/**
 * OpenAPI -> TypeScript type generator.
 *
 * Reads `openapi/*.json` (committed copies of Trendyol's published specs) and emits
 * `src/generated/<module>.ts`. Generated files are pure types: no runtime code, no
 * hand edits. When Trendyol changes an endpoint, refresh the spec and re-run this.
 *
 *   node tools/generate.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_DIR = join(ROOT, 'openapi');
const OVERLAY_DIR = join(SPEC_DIR, 'overlays');
const OUT_DIR = join(ROOT, 'src', 'generated');

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'];
const RESERVED = new Set(['default', 'delete', 'new', 'function', 'class', 'in', 'for']);

// ---------------------------------------------------------------- naming ----

const pascal = (s) =>
  String(s)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

const isIdent = (s) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s) && !RESERVED.has(s);
const propKey = (s) => (isIdent(s) ? s : JSON.stringify(s));
const refName = (ref) => pascal(ref.split('/').pop());

// ------------------------------------------------------------ type render ----

/** Render an OpenAPI schema as a TypeScript type expression. */
function renderType(schema, indent, spec) {
  if (!schema || typeof schema !== 'object') return 'unknown';
  if (schema.$ref) return refName(schema.$ref);

  const nullable = schema.nullable === true ? ' | null' : '';

  if (Array.isArray(schema.enum) && schema.enum.length) {
    const union = schema.enum.map((v) => (typeof v === 'string' ? JSON.stringify(v) : String(v))).join(' | ');
    return union + nullable;
  }

  switch (schema.type) {
    case 'string':
      // `format: binary` is an upload field, not a string the caller can build.
      if (schema.format === 'binary') return 'FileInput' + nullable;
      return 'string' + nullable;
    case 'integer':
    case 'number':
      return 'number' + nullable;
    case 'boolean':
      return 'boolean' + nullable;
    case 'array': {
      const inner = renderType(schema.items, indent, spec);
      const needsParens = /[|&]/.test(inner) && !inner.startsWith('{');
      return (needsParens ? `Array<${inner}>` : `${inner}[]`) + nullable;
    }
    case 'object':
    default: {
      if (schema.properties && Object.keys(schema.properties).length) {
        return renderObjectBody(schema, indent, spec) + nullable;
      }
      if (schema.additionalProperties) {
        const v =
          schema.additionalProperties === true
            ? 'unknown'
            : renderType(schema.additionalProperties, indent, spec);
        return `Record<string, ${v}>` + nullable;
      }
      if (schema.type === 'object') return 'Record<string, unknown>' + nullable;
      return 'unknown';
    }
  }
}

/** Render `{ ... }` for an object schema, one property per line with JSDoc. */
function renderObjectBody(schema, indent, spec) {
  const pad = '  '.repeat(indent + 1);
  const required = new Set(schema.required ?? []);
  const lines = ['{'];
  for (const [name, prop] of Object.entries(schema.properties)) {
    const doc = jsdoc(prop, pad);
    if (doc) lines.push(doc);
    const opt = required.has(name) ? '' : '?';
    lines.push(`${pad}${propKey(name)}${opt}: ${renderType(prop, indent + 1, spec)};`);
  }
  lines.push('  '.repeat(indent) + '}');
  return lines.join('\n');
}

/** Build a JSDoc block from a schema's description / example / constraints. */
function jsdoc(schema, pad, extra = []) {
  if (!schema && !extra.length) return '';
  const parts = [];
  if (schema?.description) parts.push(...String(schema.description).trim().split('\n'));
  if (schema?.format) parts.push(`@format ${schema.format}`);
  if (schema?.default !== undefined) parts.push(`@default ${JSON.stringify(schema.default)}`);
  if (schema?.maximum !== undefined) parts.push(`@maximum ${schema.maximum}`);
  if (schema?.example !== undefined && typeof schema.example !== 'object')
    parts.push(`@example ${JSON.stringify(schema.example)}`);
  if (schema?.['x-observed']) {
    if (schema['x-observed-note']) parts.push(schema['x-observed-note']);
    parts.push(`@remarks Returned by the API but absent from Trendyol's published spec (observed ${schema['x-observed']}).`);
  }
  parts.push(...extra);
  if (!parts.length) return '';
  const safe = parts.map((l) => l.replace(/\*\//g, '*\\/').trimEnd());
  if (safe.length === 1) return `${pad}/** ${safe[0]} */`;
  return [`${pad}/**`, ...safe.map((l) => `${pad} * ${l}`), `${pad} */`].join('\n');
}

/** Emit `export interface X { ... }` or `export type X = ...`. */
function declare(name, schema, spec, { asAlias = false } = {}) {
  const doc = jsdoc(schema, '');
  const head = doc ? doc + '\n' : '';
  const isObject = schema.type === 'object' || (!schema.type && schema.properties);
  if (isObject && schema.properties && Object.keys(schema.properties).length) {
    // Query/header bags are emitted as aliases: only type aliases get an
    // implicit index signature, which is what lets them flow into the
    // transport's `Record<string, QueryValue>` without a cast.
    if (asAlias) return `${head}export type ${name} = ${renderObjectBody(schema, 0, spec)};\n`;
    return `${head}export interface ${name} ${renderObjectBody(schema, 0, spec)}\n`;
  }
  return `${head}export type ${name} = ${renderType(schema, 0, spec)};\n`;
}

// ------------------------------------------------------------- operations ----

/** Pick the JSON-ish body schema out of a requestBody / response `content` map. */
function pickContent(content) {
  if (!content) return null;
  const key =
    Object.keys(content).find((k) => k.includes('json')) ??
    Object.keys(content).find((k) => k.includes('form-data')) ??
    Object.keys(content)[0];
  if (!key) return null;
  return { mediaType: key, schema: content[key].schema };
}

function successResponse(op) {
  const codes = Object.keys(op.responses ?? {}).filter((c) => /^2\d\d$/.test(c));
  if (!codes.length) return null;
  const code = codes.sort()[0];
  return { code, ...(op.responses[code] ?? {}) };
}

/** Follow a `$ref` into `components/parameters`; pass other parameters through. */
function resolveParam(spec, param) {
  if (!param?.$ref) return param;
  const key = param.$ref.split('/').pop();
  const resolved = spec.components?.parameters?.[key];
  if (!resolved) throw new Error(`Unresolved parameter $ref: ${param.$ref}`);
  return resolved;
}

/** Collect every operation of a spec into a normalised shape. */
export function collectOperations(spec) {
  const ops = [];
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const op = item[method];
      if (!op) continue;
      const params = [...(item.parameters ?? []), ...(op.parameters ?? [])].map((p) => resolveParam(spec, p));
      ops.push({
        operationId: op.operationId ?? `${method}${pascal(path)}`,
        method: method.toUpperCase(),
        path,
        summary: op.summary,
        description: op.description,
        tags: op.tags ?? [],
        pathParams: params.filter((p) => p.in === 'path'),
        queryParams: params.filter((p) => p.in === 'query'),
        headerParams: params.filter((p) => p.in === 'header'),
        body: pickContent(op.requestBody?.content),
        bodyRequired: op.requestBody?.required === true,
        response: successResponse(op),
      });
    }
  }
  return ops;
}

// ------------------------------------------------------------------ emit ----

function generateModule(moduleName, spec) {
  const out = [];
  /** Names already declared in this module, so operation aliases never shadow a component. */
  const declared = new Set();

  /** Declare `name`, skipping aliases that would resolve to themselves. */
  const emit = (name, target, render) => {
    if (declared.has(name)) {
      if (target === name) return; // component schema already declares exactly this type
      console.warn(`  ! ${moduleName}: name collision on ${name}, emitting as ${name}Payload`);
      name = `${name}Payload`;
    }
    declared.add(name);
    out.push(render(name));
  };
  out.push('/* eslint-disable */');
  out.push('/**');
  out.push(` * ${spec.info?.title ?? moduleName}`);
  if (spec.info?.description) out.push(` * ${String(spec.info.description).replace(/\n/g, ' ')}`);
  out.push(' *');
  out.push(' * GENERATED FILE — do not edit by hand.');
  out.push(` * Source: openapi/${moduleName}.json · regenerate with \`npm run generate\`.`);
  out.push(' */');
  out.push('');
  const importSlot = out.length;

  const schemas = spec.components?.schemas ?? {};
  for (const [name, schema] of Object.entries(schemas)) {
    if (name === 'Error') continue; // the SDK ships its own error model
    declared.add(pascal(name));
    out.push(declare(pascal(name), schema, spec));
  }

  for (const op of collectOperations(spec)) {
    const base = pascal(op.operationId);

    if (op.queryParams.length) {
      const schema = {
        type: 'object',
        description: `Query parameters for \`${op.method} ${op.path}\`.`,
        required: op.queryParams.filter((p) => p.required).map((p) => p.name),
        properties: Object.fromEntries(
          op.queryParams.map((p) => [p.name, { ...(p.schema ?? {}), description: p.description }])
        ),
      };
      emit(`${base}Query`, null, (n) => declare(n, schema, spec, { asAlias: true }));
    }

    if (op.headerParams.length) {
      const schema = {
        type: 'object',
        description: `Optional headers accepted by \`${op.method} ${op.path}\`.`,
        required: op.headerParams.filter((p) => p.required).map((p) => p.name),
        properties: Object.fromEntries(
          op.headerParams.map((p) => [p.name, { ...(p.schema ?? {}), description: p.description }])
        ),
      };
      emit(`${base}Headers`, null, (n) => declare(n, schema, spec, { asAlias: true }));
    }

    if (op.body?.schema) {
      const s = op.body.schema;
      if (s.$ref) {
        emit(`${base}Body`, refName(s.$ref), (n) =>
          `/** Request body for \`${op.method} ${op.path}\`. */\nexport type ${n} = ${refName(s.$ref)};\n`);
      } else {
        emit(`${base}Body`, null, (n) =>
          declare(n, { ...s, description: s.description ?? `Request body for \`${op.method} ${op.path}\`.` }, spec));
      }
    }

    const rc = pickContent(op.response?.content);
    if (rc?.schema) {
      const s = rc.schema;
      if (s.$ref) {
        emit(`${base}Response`, refName(s.$ref), (n) =>
          `/** Response of \`${op.method} ${op.path}\`. */\nexport type ${n} = ${refName(s.$ref)};\n`);
      } else {
        emit(`${base}Response`, null, (n) =>
          declare(n, { ...s, description: s.description ?? `Response of \`${op.method} ${op.path}\`.` }, spec));
      }
    } else {
      emit(`${base}Response`, null, (n) =>
        `/** \`${op.method} ${op.path}\` returns no response body. */\nexport type ${n} = void;\n`);
    }
  }

  const rendered = out.join('\n');
  if (/\bFileInput\b/.test(rendered)) {
    out.splice(importSlot, 0, "import type { FileInput } from '../core/http/form-data.js';", '');
  }
  return out.join('\n');
}

// --------------------------------------------------------------- overlays ----

/**
 * Apply `openapi/overlays/<module>.json` on top of a spec.
 *
 * Trendyol's published documents are incomplete: production returns fields they
 * never describe, and a couple of fields carry the wrong type. Those findings
 * live in overlays rather than in the specs themselves, so `npm run specs:fetch`
 * can overwrite the specs without losing them. `tools/observe.mjs` regenerates
 * the overlays from live responses.
 *
 * Semantics are JSON Merge Patch (RFC 7386): objects merge, `null` deletes.
 */
function applyOverlay(moduleName, spec) {
  const file = join(OVERLAY_DIR, `${moduleName}.json`);
  if (!existsSync(file)) return { spec, applied: 0 };

  const overlay = JSON.parse(readFileSync(file, 'utf8'));
  let applied = 0;

  const merge = (base, patch) => {
    if (patch === null) return undefined;
    if (typeof patch !== 'object' || Array.isArray(patch)) return patch;
    const target = base && typeof base === 'object' && !Array.isArray(base) ? { ...base } : {};
    for (const [key, value] of Object.entries(patch)) {
      if (key === 'x-observed') applied++;
      const merged = merge(target[key], value);
      if (merged === undefined) delete target[key];
      else target[key] = merged;
    }
    return target;
  };

  return { spec: merge(spec, overlay), applied };
}

// ------------------------------------------------------------------ main ----

function main() {
  const manifest = JSON.parse(readFileSync(join(SPEC_DIR, 'manifest.json'), 'utf8'));
  const NON_SPEC = new Set(['manifest.json', 'catalog.json', 'verification.json']);
  const files = readdirSync(SPEC_DIR).filter((f) => f.endsWith('.json') && !NON_SPEC.has(f));
  const index = [];
  const catalog = [];

  for (const file of files.sort()) {
    const moduleName = file.replace(/\.json$/, '');
    const raw = JSON.parse(readFileSync(join(SPEC_DIR, file), 'utf8'));
    const { spec, applied } = applyOverlay(moduleName, raw);
    writeFileSync(join(OUT_DIR, `${moduleName}.ts`), generateModule(moduleName, spec) + '\n');
    index.push(moduleName);
    const ops = collectOperations(spec);
    catalog.push({ module: moduleName, title: spec.info?.title, servers: (spec.servers ?? []).map((s) => s.url), operations: ops.map((o) => ({ operationId: o.operationId, method: o.method, path: o.path, tags: o.tags, summary: o.summary })) });
    console.log(
      `${moduleName.padEnd(18)} ${String(ops.length).padStart(3)} operations` +
        (applied ? `  (+${applied} observed field${applied === 1 ? '' : 's'} from overlay)` : '')
    );
  }

  const barrel = [
    '/**',
    ' * Barrel for generated request/response types.',
    ' *',
    ' * GENERATED FILE — do not edit by hand. Run `npm run generate`.',
    ' */',
    '',
    ...index.map((m) => `export type * from './${m}.js';`),
    '',
  ].join('\n');
  writeFileSync(join(OUT_DIR, 'index.ts'), barrel);
  writeFileSync(join(SPEC_DIR, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
  console.log(`\n${catalog.reduce((n, c) => n + c.operations.length, 0)} operations across ${index.length} modules (${manifest.specs.length} specs in manifest).`);
}

main();
