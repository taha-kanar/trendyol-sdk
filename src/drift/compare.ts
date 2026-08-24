/**
 * Structural comparison between a live payload and the schema that describes it.
 *
 * Trendyol's published specs lag behind the running API. `openapi/overlays/`
 * records what we already know is missing; this module is how new gaps are
 * found — from probe scripts offline, or from real traffic via
 * `createDriftMiddleware`.
 *
 * Pure and dependency-free: no filesystem, no network, safe in any runtime.
 */

/** A minimal view of the parts of an OpenAPI document this module needs. */
export interface SchemaDocument {
  components?: { schemas?: Record<string, JsonSchema> };
  paths?: Record<string, Record<string, OperationObject>>;
}

export interface OperationObject {
  operationId?: string;
  responses?: Record<string, { content?: Record<string, { schema?: JsonSchema }> }>;
}

/** The subset of JSON Schema that Trendyol's documents actually use. */
export interface JsonSchema {
  $ref?: string;
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
  format?: string;
  enum?: unknown[];
  nullable?: boolean;
  properties?: Record<string, JsonSchema>;
  additionalProperties?: boolean | JsonSchema;
  items?: JsonSchema;
  required?: string[];
}

/** What kind of gap was found between the payload and the schema. */
export type DriftKind = 'undocumented-field' | 'unexpected-type' | 'unexpected-enum-value';

export interface DriftFinding {
  kind: DriftKind;
  /** Dotted path into the payload, e.g. `content[0].lines[0].vatRate`. */
  path: string;
  /** What the schema promised, when it promised anything. */
  expected?: string | undefined;
  /** What the payload actually held — a type name, never a value. */
  actual: string;
  /**
   * Where the fix belongs in the OpenAPI document, as a JSON path.
   *
   * `['components','schemas','ShipmentPackage','properties','invoiceNumber']`
   * — this is what lets `tools/observe.mjs` turn a finding into an overlay
   * entry without guessing which schema the field came from.
   */
  schemaPath: string[];
}

export interface CompareOptions {
  /** Document path of `schema`, used as the root of every finding's `schemaPath`. */
  schemaPath?: string[];
  /** How many elements of each array to inspect. Default 3. */
  sampleSize?: number;
  /** Stop after this many findings, so a wildly stale schema cannot flood a log. Default 200. */
  limit?: number;
}

const typeOf = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

/**
 * Walk `value` against `schema`, reporting everything the schema fails to describe.
 *
 * Only names and types are reported — never values — so findings are safe to
 * log in production.
 */
export function findSchemaDrift(
  document: SchemaDocument,
  schema: JsonSchema | undefined,
  value: unknown,
  rootPath = '',
  options: CompareOptions = {}
): DriftFinding[] {
  const sampleSize = options.sampleSize ?? 3;
  const limit = options.limit ?? 200;
  const findings: DriftFinding[] = [];

  const resolve = (
    candidate: JsonSchema | undefined,
    seen: ReadonlySet<string>
  ): { schema?: JsonSchema | undefined; seen: ReadonlySet<string> } => {
    let current = candidate;
    let visited = seen;
    while (current?.$ref) {
      const name = current.$ref.split('/').pop() ?? '';
      if (visited.has(name)) return { seen: visited }; // recursive schema; stop here
      visited = new Set([...visited, name]);
      current = document.components?.schemas?.[name];
    }
    return { schema: current, seen: visited };
  };

  const walk = (
    candidate: JsonSchema | undefined,
    node: unknown,
    path: string,
    seen: ReadonlySet<string>,
    schemaPath: string[]
  ): void => {
    if (findings.length >= limit) return;
    // A `$ref` moves the document position to the component it names, so a
    // finding points at the shared schema rather than at one response.
    const refName = candidate?.$ref?.split('/').pop();
    const { schema: resolved, seen: nextSeen } = resolve(candidate, seen);
    const here = refName ? ['components', 'schemas', refName] : schemaPath;
    if (!resolved || node === null || node === undefined) return;

    if (Array.isArray(node)) {
      if (resolved.type && resolved.type !== 'array') {
        findings.push({ kind: 'unexpected-type', path, expected: resolved.type, actual: 'array', schemaPath: here });
        return;
      }
      for (const [index, item] of node.slice(0, sampleSize).entries()) {
        if (findings.length >= limit) return;
        walk(resolved.items, item, `${path}[${index}]`, nextSeen, [...here, 'items']);
      }
      return;
    }

    if (typeof node === 'object') {
      // No properties, or a free-form map: there is nothing to contradict.
      if (!resolved.properties || resolved.additionalProperties) return;

      for (const [key, child] of Object.entries(node)) {
        // Re-checked per property: a badly stale schema can add dozens of
        // findings inside a single object.
        if (findings.length >= limit) return;
        const childPath = path ? `${path}.${key}` : key;
        const declared = resolved.properties[key];
        const childSchemaPath = [...here, 'properties', key];
        if (!declared) {
          findings.push({
            kind: 'undocumented-field',
            path: childPath,
            actual: typeOf(child),
            schemaPath: childSchemaPath,
          });
          continue;
        }
        walk(declared, child, childPath, nextSeen, childSchemaPath);
      }
      return;
    }

    if (Array.isArray(resolved.enum) && resolved.enum.length && !resolved.enum.includes(node)) {
      findings.push({
        kind: 'unexpected-enum-value',
        path,
        expected: resolved.enum.map(String).join(' | '),
        actual: typeof node === 'string' ? `string (outside the documented set)` : typeOf(node),
        schemaPath: here,
      });
      return;
    }

    const expected = resolved.type === 'integer' ? 'number' : resolved.type;
    if (expected && expected !== 'object' && typeof node !== expected) {
      findings.push({ kind: 'unexpected-type', path, expected: resolved.type, actual: typeOf(node), schemaPath: here });
    }
  };

  walk(schema, value, rootPath, new Set(), options.schemaPath ?? []);
  return findings;
}

/** An operation's success-response schema, and where it lives in the document. */
export interface ResponseSchemaLocation {
  schema: JsonSchema;
  /** JSON path of `schema` inside the document. */
  schemaPath: string[];
}

/** Find an operation's success-response schema in a document. */
export function findResponseSchema(
  document: SchemaDocument,
  operationId: string
): ResponseSchemaLocation | undefined {
  for (const [path, item] of Object.entries(document.paths ?? {})) {
    for (const [method, operation] of Object.entries(item)) {
      if (operation?.operationId !== operationId) continue;
      const code = Object.keys(operation.responses ?? {}).find((status) => status.startsWith('2'));
      const content = code ? operation.responses?.[code]?.content ?? {} : {};
      const mediaType = Object.keys(content).find((type) => type.includes('json'));
      const schema = mediaType ? content[mediaType]?.schema : undefined;
      if (!schema || !code || !mediaType) return undefined;
      return { schema, schemaPath: ['paths', path, method, 'responses', code, 'content', mediaType, 'schema'] };
    }
  }
  return undefined;
}
