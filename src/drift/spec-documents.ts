import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import type { SchemaDocument } from './compare.js';

/** Files in `openapi/` that are not OpenAPI documents. */
const NON_SPEC = new Set(['manifest.json', 'catalog.json', 'verification.json']);

/**
 * Load the OpenAPI documents shipped with the package.
 *
 * Node-only, and deliberately so: this is a staging/diagnostics tool, not
 * something to bundle into a browser build. It lives behind the
 * `trendyol-sdk/drift` entry point so the main bundle never pulls in `node:fs`.
 *
 * @param specsDir Overrides the shipped `openapi/` directory.
 */
export function loadSpecDocuments(specsDir?: string): SchemaDocument[] {
  const directory = specsDir ?? fileURLToPath(new URL('../openapi/', import.meta.url));
  return readdirSync(directory)
    .filter((file) => file.endsWith('.json') && !NON_SPEC.has(file))
    .map((file) => JSON.parse(readFileSync(join(directory, file), 'utf8')) as SchemaDocument);
}
