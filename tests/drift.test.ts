import { describe, expect, it } from 'vitest';
import { findResponseSchema, findSchemaDrift, type SchemaDocument } from '../src/drift/index.js';
import { createDriftMiddleware } from '../src/drift/middleware.js';
import { createTestClient } from './support/client.js';

const document: SchemaDocument = {
  components: {
    schemas: {
      Package: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          status: { type: 'string', enum: ['Created', 'Picking'] },
          shipmentNumber: { type: 'string' },
          lines: { type: 'array', items: { $ref: '#/components/schemas/Line' } },
        },
      },
      Line: { type: 'object', properties: { lineId: { type: 'integer' } } },
    },
  },
  paths: {
    '/orders': {
      get: {
        operationId: 'getShipmentPackages',
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { content: { type: 'array', items: { $ref: '#/components/schemas/Package' } } },
                },
              },
            },
          },
        },
      },
    },
  },
};

const responseSchema = findResponseSchema(document, 'getShipmentPackages')!;

describe('findSchemaDrift', () => {
  it('says nothing when the payload matches', () => {
    const payload = { content: [{ id: 1, status: 'Created', lines: [{ lineId: 9 }] }] };
    expect(findSchemaDrift(document, responseSchema.schema, payload)).toEqual([]);
  });

  it('reports fields the schema never mentions', () => {
    const payload = { content: [{ id: 1, invoiceNumber: 'ABC123', micro: true }] };
    const findings = findSchemaDrift(document, responseSchema.schema, payload);

    expect(findings.map((f) => f.path)).toEqual(['content[0].invoiceNumber', 'content[0].micro']);
    expect(findings[0]!.kind).toBe('undocumented-field');
    expect(findings[0]!.actual).toBe('string');
  });

  it('reports the value type, never the value', () => {
    const payload = { content: [{ id: 1, customerEmail: 'someone@example.com' }] };
    const serialised = JSON.stringify(findSchemaDrift(document, responseSchema.schema, payload));

    expect(serialised).not.toContain('someone@example.com');
    expect(serialised).toContain('string');
  });

  it('points at the shared component a field belongs to', () => {
    const payload = { content: [{ id: 1, lines: [{ lineId: 9, vatRate: 20 }] }] };
    const [finding] = findSchemaDrift(document, responseSchema.schema, payload, '', {
      schemaPath: responseSchema.schemaPath,
    });

    expect(finding!.schemaPath).toEqual(['components', 'schemas', 'Line', 'properties', 'vatRate']);
  });

  it('catches a documented field carrying the wrong type', () => {
    const payload = { content: [{ shipmentNumber: 1234567 }] };
    const [finding] = findSchemaDrift(document, responseSchema.schema, payload);

    expect(finding).toMatchObject({ kind: 'unexpected-type', expected: 'string', actual: 'number' });
  });

  it('catches an enum value outside the documented set', () => {
    const payload = { content: [{ status: 'AtCollectionPoint' }] };
    const [finding] = findSchemaDrift(document, responseSchema.schema, payload);

    expect(finding!.kind).toBe('unexpected-enum-value');
    expect(finding!.expected).toBe('Created | Picking');
  });

  it('ignores nulls, and free-form objects that permit anything', () => {
    const permissive: SchemaDocument = {
      paths: {
        '/x': {
          get: {
            operationId: 'x',
            responses: { '200': { content: { 'application/json': { schema: { type: 'object', properties: { params: { type: 'object', additionalProperties: true } } } } } } },
          },
        },
      },
    };
    const schema = findResponseSchema(permissive, 'x')!.schema;
    expect(findSchemaDrift(permissive, schema, { params: { whatever: 1 } })).toEqual([]);
  });

  it('stops at the configured limit', () => {
    const payload = { content: [Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`extra${i}`, i]))] };
    expect(findSchemaDrift(document, responseSchema.schema, payload, '', { limit: 5 })).toHaveLength(5);
  });

  it('survives a self-referential schema', () => {
    const recursive: SchemaDocument = {
      components: {
        schemas: {
          Node: { type: 'object', properties: { child: { $ref: '#/components/schemas/Node' } } },
        },
      },
      paths: {
        '/tree': {
          get: {
            operationId: 'tree',
            responses: { '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Node' } } } } },
          },
        },
      },
    };
    const schema = findResponseSchema(recursive, 'tree')!.schema;
    expect(() => findSchemaDrift(recursive, schema, { child: { child: { child: {} } } })).not.toThrow();
  });
});

describe('createDriftMiddleware', () => {
  it('reports drift on a live response without changing it', async () => {
    const reports: unknown[] = [];
    const { client, http } = createTestClient({
      middleware: [createDriftMiddleware({ documents: [document], onDrift: (report) => reports.push(report) })],
    });
    http.enqueueJson({ content: [{ id: 1, invoiceNumber: 'ABC' }] });

    const page = await client.orders.list();

    expect(page).toEqual({ content: [{ id: 1, invoiceNumber: 'ABC' }] });
    expect(reports).toHaveLength(1);
    expect(reports[0]).toMatchObject({ operationId: 'getShipmentPackages', status: 200 });
  });

  it('stays quiet when the response matches', async () => {
    const reports: unknown[] = [];
    const { client, http } = createTestClient({
      middleware: [createDriftMiddleware({ documents: [document], onDrift: (report) => reports.push(report) })],
    });
    http.enqueueJson({ content: [{ id: 1, status: 'Picking' }] });

    await client.orders.list();
    expect(reports).toEqual([]);
  });

  it('ignores errors and non-JSON bodies', async () => {
    const reports: unknown[] = [];
    const { client, http } = createTestClient({
      middleware: [createDriftMiddleware({ documents: [document], onDrift: (report) => reports.push(report) })],
    });
    http.enqueue({ status: 500, body: '<html>', headers: {} });

    await expect(client.orders.list()).rejects.toThrow();
    expect(reports).toEqual([]);
  });
});
