import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guards the SDK against drift in Trendyol's API.
 *
 * `openapi/catalog.json` is regenerated from the specs, so after
 * `npm run specs:fetch && npm run generate` these tests fail the moment
 * Trendyol adds, removes, renames or re-routes an endpoint. That failure is
 * the point: it turns a silent documentation change into a red build.
 */

const ROOT = join(__dirname, '..');

interface CatalogOperation {
  operationId: string;
  method: string;
  path: string;
  tags: string[];
}

interface CatalogEntry {
  module: string;
  servers: string[];
  operations: CatalogOperation[];
}

const catalog: CatalogEntry[] = JSON.parse(readFileSync(join(ROOT, 'openapi', 'catalog.json'), 'utf8'));

/** Prefix a spec's server URL adds on top of the gateway root, e.g. `/webhook`. */
function serverPrefix(entry: CatalogEntry): string {
  const server = entry.servers[0] ?? '';
  return server.replace(/^https:\/\/[^/]+\/integration/, '');
}

/** Every `{ operationId, method, path }` triple the resource classes implement. */
function readImplementedOperations(): Map<string, { method: string; path: string; file: string }> {
  const implemented = new Map<string, { method: string; path: string; file: string }>();
  const dir = join(ROOT, 'src', 'resources');

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.resource.ts'))) {
    const source = readFileSync(join(dir, file), 'utf8');
    const prefix = /const PREFIX = '([^']+)'/.exec(source)?.[1] ?? '';
    const calls = source.matchAll(
      /operationId: '(\w+)',\s*\n\s*method: '(\w+)',\s*\n\s*path: [`']([^`']+)[`'],/g
    );

    for (const [, operationId, method, rawPath] of calls) {
      implemented.set(operationId!, {
        method: method!,
        path: rawPath!.replace('${PREFIX}', prefix),
        file,
      });
    }
  }
  return implemented;
}

const implemented = readImplementedOperations();
const documented = catalog.flatMap((entry) =>
  entry.operations.map((operation) => ({ ...operation, module: entry.module, prefix: serverPrefix(entry) }))
);

describe('spec coverage', () => {
  it('documents the expected number of operations', () => {
    expect(documented.length).toBeGreaterThan(0);
    expect(implemented.size).toBe(documented.length);
  });

  it.each(documented)('implements $operationId ($module)', (operation) => {
    const actual = implemented.get(operation.operationId);
    expect(actual, `${operation.operationId} is documented but no resource implements it`).toBeDefined();
    expect(actual!.method).toBe(operation.method);
    expect(actual!.path).toBe(operation.prefix + operation.path);
  });

  it('implements nothing that the specs no longer document', () => {
    const documentedIds = new Set(documented.map((operation) => operation.operationId));
    const orphans = [...implemented.entries()]
      .filter(([operationId]) => !documentedIds.has(operationId))
      .map(([operationId, meta]) => `${operationId} (${meta.file})`);

    expect(orphans, 'these operations are gone from the specs').toEqual([]);
  });
});
