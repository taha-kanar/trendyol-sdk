/**
 * Refresh `openapi/*.json` from Trendyol's live documentation.
 *
 * The docs are published on readme.io, which server-renders each reference page
 * with the *whole* OpenAPI document of its section embedded in the HTML. So one
 * page per spec is enough — `openapi/manifest.json` records which page belongs
 * to which spec.
 *
 *   node tools/fetch-specs.mjs            # refresh everything
 *   node tools/fetch-specs.mjs marketplace product
 *
 * Afterwards run `npm run generate` and review the diff: a changed spec means
 * Trendyol changed the API, and the resource classes may need to follow.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_DIR = join(ROOT, 'openapi');
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** Pull every balanced `{"openapi":"3...}` object out of a page. */
function extractSpecs(html) {
  const specs = [];
  const pattern = /\{"openapi":"3/g;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const start = match.index;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < html.length; i++) {
      const char = html[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') inString = true;
      else if (char === '{') depth++;
      else if (char === '}' && --depth === 0) {
        try {
          specs.push(JSON.parse(html.slice(start, i + 1)));
        } catch {
          // A partial or escaped match — the next candidate may still parse.
        }
        break;
      }
    }
  }
  return specs;
}

async function refresh(entry) {
  const response = await fetch(entry.sourcePage, { headers: { 'user-agent': USER_AGENT } });
  if (!response.ok) throw new Error(`${entry.sourcePage} -> HTTP ${response.status}`);

  const specs = extractSpecs(await response.text());
  const spec = specs.find((s) => s.info?.title === entry.title) ?? specs[0];
  if (!spec) throw new Error(`No OpenAPI document found on ${entry.sourcePage}`);
  if (spec.info?.title !== entry.title) {
    console.warn(`  ! ${entry.module}: page now serves "${spec.info?.title}" (manifest says "${entry.title}")`);
  }

  const target = join(SPEC_DIR, entry.file);
  const next = JSON.stringify(spec, null, 2) + '\n';
  let previous = '';
  try {
    previous = readFileSync(target, 'utf8');
  } catch {
    // First fetch of a newly added spec.
  }

  writeFileSync(target, next);
  const operations = Object.values(spec.paths ?? {}).reduce(
    (n, item) => n + Object.keys(item).filter((k) => ['get', 'post', 'put', 'delete', 'patch'].includes(k)).length,
    0
  );
  return { changed: previous !== next, operations };
}

const manifest = JSON.parse(readFileSync(join(SPEC_DIR, 'manifest.json'), 'utf8'));
const only = process.argv.slice(2);
const targets = only.length ? manifest.specs.filter((s) => only.includes(s.module)) : manifest.specs;
if (!targets.length) {
  console.error(`No specs matched: ${only.join(', ')}`);
  process.exit(1);
}

let changed = 0;
for (const entry of targets) {
  try {
    const { changed: didChange, operations } = await refresh(entry);
    if (didChange) changed++;
    console.log(`${didChange ? 'updated' : 'unchanged'}  ${entry.module.padEnd(18)} ${String(operations).padStart(3)} operations`);
  } catch (error) {
    console.error(`failed    ${entry.module.padEnd(18)} ${error.message}`);
    process.exitCode = 1;
  }
}

console.log(
  changed
    ? `\n${changed} spec(s) changed — run \`npm run generate\` and check the diff.`
    : '\nAll specs already up to date.'
);
