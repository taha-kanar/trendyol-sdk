/**
 * Compare live API responses against the committed specs, and record the gaps.
 *
 * Trendyol's published OpenAPI documents lag behind the running API: fields are
 * missing and a few are typed wrongly. Editing `openapi/*.json` is not an
 * option — `specs:fetch` overwrites it — so differences are written to
 * `openapi/overlays/<module>.json`, a JSON Merge Patch that `generate.mjs`
 * applies at codegen time.
 *
 *   TRENDYOL_SELLER_ID=… TRENDYOL_API_KEY=… TRENDYOL_API_SECRET=… \
 *     node tools/observe.mjs [--write]
 *
 * Every probe is read-only: this tool never changes anything in the account.
 * Only field names and types are recorded — never values — so nothing from the
 * seller's data reaches the repository.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TrendyolClient, TrendyolError } from '../dist/index.js';
import { findResponseSchema, findSchemaDrift } from '../dist/drift.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC_DIR = join(ROOT, 'openapi');
const OVERLAY_DIR = join(SPEC_DIR, 'overlays');
const WRITE = process.argv.includes('--write');
const OBSERVED_ON = process.env.OBSERVED_ON ?? new Date().toISOString().slice(0, 10);

const specs = {};
for (const file of readdirSync(SPEC_DIR)) {
  if (!file.endsWith('.json') || ['manifest.json', 'catalog.json', 'verification.json'].includes(file)) continue;
  specs[file.replace('.json', '')] = JSON.parse(readFileSync(join(SPEC_DIR, file), 'utf8'));
}

/** Describe a live value as a schema — names and types only, never values. */
function infer(value) {
  if (value === null) return { nullable: true };
  if (Array.isArray(value)) {
    const sample = value.find((item) => item !== null && item !== undefined);
    return { type: 'array', items: sample === undefined ? {} : infer(sample) };
  }
  switch (typeof value) {
    case 'number':
      return Number.isInteger(value) ? { type: 'integer', format: 'int64' } : { type: 'number', format: 'double' };
    case 'boolean':
      return { type: 'boolean' };
    case 'string':
      return { type: 'string' };
    case 'object': {
      const properties = {};
      for (const [key, child] of Object.entries(value)) properties[key] = infer(child);
      return { type: 'object', properties };
    }
    default:
      return {};
  }
}

/** Read the value a payload path points at, so a finding can be typed. */
function valueAt(payload, path) {
  if (!path) return payload;
  let node = payload;
  for (const segment of path.split('.')) {
    const [, key, indexes] = /^([^[]*)((?:\[\d+\])*)$/.exec(segment) ?? [];
    if (key) node = node?.[key];
    for (const index of indexes?.match(/\d+/g) ?? []) node = node?.[Number(index)];
    if (node === undefined) return undefined;
  }
  return node;
}

function setAt(target, path, value) {
  let node = target;
  for (const segment of path.slice(0, -1)) {
    node[segment] ??= {};
    node = node[segment];
  }
  node[path.at(-1)] = value;
}

function mergeDeep(base, patch) {
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && out[key] && typeof out[key] === 'object'
        ? mergeDeep(out[key], value)
        : value;
  }
  return out;
}

const client = new TrendyolClient({
  sellerId: process.env.TRENDYOL_SELLER_ID,
  apiKey: process.env.TRENDYOL_API_KEY,
  apiSecret: process.env.TRENDYOL_API_SECRET,
  environment: process.env.TRENDYOL_ENV ?? 'production',
});

const DAY = 86_400_000;
const now = Date.now();

/**
 * Read-only probes, in order.
 *
 * Later probes reuse ids discovered by earlier ones (`ctx`), which is what lets
 * detail endpoints be covered at all — there is no other way to learn a valid
 * claim item id or barcode without writing to the account first. A probe that
 * returns `null` had no id to work with and is reported as skipped.
 */
const PROBES = [
  ['getShipmentPackages', async (ctx) => {
    const page = await client.orders.list({ size: 20 });
    ctx.package = page.content?.[0];
    ctx.cargoTrackingNumber = page.content?.find((p) => p.cargoTrackingNumber)?.cargoTrackingNumber;
    return page;
  }],
  ['getShipmentPackagesStream', () => client.orders.listStream({ size: 20 })],
  ['getClaims', async (ctx) => {
    const page = await client.claims.list({ size: 20 });
    ctx.claimItemId = page.content?.[0]?.items?.[0]?.claimItems?.[0]?.id;
    return page;
  }],
  ['getClaimIssueReasons', () => client.claims.issueReasons()],
  ['getClaimItemAudits', (ctx) => (ctx.claimItemId ? client.claims.itemAudits(ctx.claimItemId) : null)],
  ['getCountries', async (ctx) => {
    const countries = await client.addresses.countries();
    ctx.countryCode = countries?.find((c) => c.code && c.code !== 'TR')?.code ?? countries?.[0]?.code;
    return countries;
  }],
  ['getCitiesByCountry', async (ctx) => {
    if (!ctx.countryCode) return null;
    const cities = await client.addresses.cities(ctx.countryCode);
    ctx.cityId = cities?.[0]?.id ?? cities?.[0]?.code;
    return cities;
  }],
  ['getDistrictsByCity', (ctx) =>
    ctx.countryCode && ctx.cityId ? client.addresses.districts(ctx.countryCode, ctx.cityId) : null],
  ['getTurkeyCities', async (ctx) => {
    const cities = await client.addresses.turkeyCities();
    ctx.trCityId = cities?.[0]?.id; // the `code` field is rejected by the districts endpoint
    return cities;
  }],
  ['getTurkeyDistricts', async (ctx) => {
    if (!ctx.trCityId) return null;
    const districts = await client.addresses.turkeyDistricts(ctx.trCityId);
    ctx.trDistrictId = districts?.[0]?.id;
    return districts;
  }],
  ['getTurkeyNeighborhoods', (ctx) =>
    ctx.trCityId && ctx.trDistrictId
      ? client.addresses.turkeyNeighborhoods(ctx.trCityId, ctx.trDistrictId)
      : null],
  ['getAzerbaijanCities', async (ctx) => {
    const cities = await client.addresses.azerbaijanCities();
    ctx.azCityId = cities?.[0]?.id;
    return cities;
  }],
  ['getAzerbaijanDistricts', (ctx) =>
    ctx.azCityId ? client.addresses.azerbaijanDistricts(ctx.azCityId) : null],
  ['getSuppliersAddresses', () => client.supplierAddresses.list()],
  ['getCargoProviders', () => client.lookup.cargoProviders()],
  ['getBrands', async (ctx) => {
    const page = await client.brands.list({ page: 0, size: 20 });
    ctx.brandName = page.brands?.[0]?.name;
    return page;
  }],
  ['getBrandsByName', (ctx) => (ctx.brandName ? client.brands.searchByName({ name: ctx.brandName }) : null)],
  ['getCategoryTree', async (ctx) => {
    const tree = await client.categories.tree();
    const leaf = (nodes) => {
      for (const node of nodes ?? []) {
        if (!node.subCategories?.length) return node;
        const found = leaf(node.subCategories);
        if (found) return found;
      }
      return undefined;
    };
    ctx.categoryId = leaf(tree?.categories)?.id;
    return tree;
  }],
  ['getCategoryAttributes', async (ctx) => {
    if (!ctx.categoryId) return null;
    const attributes = await client.categories.attributes(ctx.categoryId);
    const withValues = attributes?.categoryAttributes?.find((a) => a.attribute?.id);
    ctx.attributeId = withValues?.attribute?.id;
    return attributes;
  }],
  ['getCategoryAttributeValues', (ctx) =>
    ctx.categoryId && ctx.attributeId
      ? client.categories.attributeValues(ctx.categoryId, ctx.attributeId, { size: 20 })
      : null],
  ['filterApprovedProducts', async (ctx) => {
    const page = await client.products.listApproved({ size: 20 });
    ctx.barcode = page.content?.[0]?.variants?.[0]?.barcode; // barcodes live on variants, not on the product
    ctx.contentId = page.content?.[0]?.contentId;
    return page;
  }],
  ['filterUnapprovedProducts', () => client.products.listUnapproved({ size: 20 })],
  ['filterApprovedProductsInventoryAndPrice', () => client.products.listApprovedInventoryAndPrice({ size: 20 })],
  ['getProductBase', (ctx) => (ctx.barcode ? client.products.getByBarcode(ctx.barcode) : null)],
  ['getUpdateAudits', (ctx) => (ctx.contentId ? client.productUpdates.audits(ctx.contentId) : null)],
  ['getQuestionFilter', async (ctx) => {
    const page = await client.questions.list({ size: 20 });
    ctx.questionId = page.content?.[0]?.id;
    return page;
  }],
  ['getQuestion', (ctx) => (ctx.questionId ? client.questions.get(ctx.questionId) : null)],
  ['getWebhooks', () => client.webhooks.list()],
  ['getSettlements', () =>
    client.finance.settlements({ startDate: now - 14 * DAY, endDate: now, transactionType: 'Sale' })],
  ['getOtherFinancials', () =>
    client.finance.otherFinancials({ startDate: now - 14 * DAY, endDate: now, transactionType: 'CommissionAgreementInvoice' })],
  ['getCompensationTickets', () => client.express.compensationTickets({ size: 20 })],
  ['getCommonLabel', (ctx) => (ctx.cargoTrackingNumber ? client.commonLabels.get(ctx.cargoTrackingNumber) : null)],
  ['getCargoInvoiceItems', (ctx) =>
    ctx.invoiceSerialNumber ? client.finance.cargoInvoiceItems(ctx.invoiceSerialNumber) : null],
  ['getBatchRequestResult', (ctx) => (ctx.batchRequestId ? client.batchRequests.result(ctx.batchRequestId) : null)],
];

const patches = {};
const outcome = { matched: [], drifted: [], skipped: [], failed: [] };
const context = {};

for (const [operationId, run] of PROBES) {
  const entry = Object.entries(specs).find(([, spec]) => findResponseSchema(spec, operationId));
  if (!entry) {
    outcome.skipped.push([operationId, 'no JSON response schema in the spec']);
    continue;
  }
  const [module, spec] = entry;
  const located = findResponseSchema(spec, operationId);

  let payload;
  try {
    payload = await run(context);
  } catch (error) {
    const detail = error instanceof TrendyolError ? `${error.name} ${error.context?.status ?? ''}` : String(error?.message);
    outcome.failed.push([operationId, detail.trim()]);
    continue;
  }
  if (payload === null || payload === undefined) {
    outcome.skipped.push([operationId, 'no id available from earlier probes']);
    continue;
  }

  const findings = findSchemaDrift(spec, located.schema, payload, '', {
    schemaPath: located.schemaPath,
    sampleSize: 5,
    limit: 500,
  });

  for (const finding of findings) {
    if (finding.kind === 'unexpected-enum-value') continue; // never widen an enum from one account's data
    const observed = valueAt(payload, finding.path);
    const note =
      finding.kind === 'unexpected-type'
        ? `Spec declares ${finding.expected}; the API returns ${finding.actual}.`
        : undefined;
    patches[module] ??= {};
    setAt(patches[module], finding.schemaPath, {
      ...infer(observed),
      'x-observed': OBSERVED_ON,
      ...(note ? { 'x-observed-note': note } : {}),
    });
  }

  (findings.length ? outcome.drifted : outcome.matched).push([operationId, findings.length]);
}

const countObserved = (node) => {
  if (!node || typeof node !== 'object') return 0;
  return ('x-observed' in node ? 1 : 0) + Object.values(node).reduce((n, v) => n + countObserved(v), 0);
};

console.log(`\nmatches (${outcome.matched.length}):`);
for (const [id] of outcome.matched) console.log(`   ${id}`);
console.log(`\ndrifts (${outcome.drifted.length}):`);
for (const [id, n] of outcome.drifted) console.log(`   ${id.padEnd(42)} ${n} finding(s)`);
if (outcome.skipped.length) {
  console.log(`\nnot probed (${outcome.skipped.length}):`);
  for (const [id, why] of outcome.skipped) console.log(`   ${id.padEnd(42)} ${why}`);
}
if (outcome.failed.length) {
  console.log(`\nfailed (${outcome.failed.length}):`);
  for (const [id, why] of outcome.failed) console.log(`   ${id.padEnd(42)} ${why}`);
}

const distinct = countObserved(patches);
console.log(
  `\n${outcome.matched.length + outcome.drifted.length}/${PROBES.length} endpoints reached; ` +
    `${distinct} schema correction(s) across ${Object.keys(patches).length} module(s).`
);

if (!WRITE) {
  console.log('Dry run — pass --write to update openapi/overlays/.');
  process.exit(0);
}

// Provenance: what was checked, when, and what could not be reached.
const verification = {
  observedOn: OBSERVED_ON,
  environment: process.env.TRENDYOL_ENV ?? 'production',
  note:
    'Written by `npm run observe -- --write`. Read-only probes only; write endpoints cannot be ' +
    'verified this way — use the drift middleware from `trendyol-sdk/drift` against your own traffic.',
  results: Object.fromEntries([
    ...outcome.matched.map(([id]) => [id, { status: 'matches-spec' }]),
    ...outcome.drifted.map(([id, n]) => [id, { status: 'drifted', findings: n }]),
    ...outcome.skipped.map(([id, why]) => [id, { status: 'not-probed', reason: why }]),
    ...outcome.failed.map(([id, why]) => [id, { status: 'failed', reason: why }]),
  ]),
};
writeFileSync(join(SPEC_DIR, 'verification.json'), JSON.stringify(verification, null, 2) + '\n');
console.log('wrote openapi/verification.json');

if (!existsSync(OVERLAY_DIR)) mkdirSync(OVERLAY_DIR, { recursive: true });
for (const [module, patch] of Object.entries(patches)) {
  const target = join(OVERLAY_DIR, `${module}.json`);
  const existing = existsSync(target) ? JSON.parse(readFileSync(target, 'utf8')) : {};
  writeFileSync(target, JSON.stringify(mergeDeep(existing, patch), null, 2) + '\n');
  console.log(`wrote openapi/overlays/${module}.json`);
}
