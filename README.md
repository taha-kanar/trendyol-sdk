# trendyol-sdk

Typed TypeScript client for the **Trendyol Marketplace Integration API** — all **80 endpoints** across orders, returns, products, inventory, finance, webhooks and more.

- **Zero dependencies.** Built on the platform `fetch`: Node 18+, browsers, Deno, Bun, Cloudflare Workers.
- **Types come from Trendyol.** Every request/response type is generated from Trendyol's own OpenAPI documents, committed under [`openapi/`](./openapi). No hand-typed field names.
- **Built for an API that keeps moving.** One command refreshes the specs, one regenerates the types, and the test suite fails loudly when an endpoint changes shape.
- **Swappable everywhere.** Transport, auth and the middleware pipeline are interfaces — mock them in tests, wrap them in production.

> Community project. Not affiliated with or endorsed by Trendyol.

## Install

Not published to a registry — install it from the repository:

```bash
npm install github:taha-kanar/trendyol-sdk
```

Or work on it locally:

```bash
git clone https://github.com/taha-kanar/trendyol-sdk.git
cd trendyol-sdk && npm install && npm run build
```

## Quick start

```ts
import { TrendyolClient } from 'trendyol-sdk';

const trendyol = new TrendyolClient({
  sellerId: 123456,
  apiKey: process.env.TRENDYOL_API_KEY!,
  apiSecret: process.env.TRENDYOL_API_SECRET!,
  integrator: 'AcmeCommerce', // your company name, or omit for 'SelfIntegration'
});

// New orders waiting to be picked
const page = await trendyol.orders.list({ status: 'Created', size: 50 });

for (const pkg of page.content ?? []) {
  await trendyol.orders.updateStatus(pkg.id!, { status: 'Picking' });
}
```

Credentials come from **Seller Panel → Hesabım → Entegrasyon Bilgilerim**. Trendyol requires a
`User-Agent` of `"{sellerId} - {integrator}"` on every request; the SDK builds it from your config, so
there is nothing to remember.

## Configuration

```ts
new TrendyolClient({
  sellerId: 123456,
  apiKey: '…',
  apiSecret: '…',

  environment: 'production',   // or 'stage' — test-order endpoints exist only on stage
  integrator: 'AcmeCommerce',  // used in the required User-Agent header
  timeoutMs: 30_000,           // per request; 0 disables
  arrayFormat: 'comma',        // '?ids=1,2,3' (default) or 'repeat' for '?ids=1&ids=2'
  logger: console,             // anything with debug/warn/error; silent by default
  defaultHeaders: { 'x-tenant': 'acme' },

  // Escape hatches — see "Extending" below
  fetch: customFetch,
  httpClient: myHttpClient,
  authenticator: myAuthenticator,
  middleware: [retryMiddleware],
});
```

## Errors

Every failure is an instance of `TrendyolError`, narrowed by what went wrong:

```ts
import { TrendyolRateLimitError, TrendyolNotFoundError, TrendyolError } from 'trendyol-sdk';

try {
  await trendyol.inventory.update({ items: [{ barcode: 'ACME-1', quantity: 12 }] });
} catch (error) {
  if (error instanceof TrendyolRateLimitError) {
    await sleep(error.retryAfterMs ?? 60_000);
  } else if (error instanceof TrendyolNotFoundError) {
    console.warn('gone:', error.details); // ['Product not found']
  } else if (error instanceof TrendyolError) {
    console.error(error.context.operationId, error.context.status, error.context.requestId);
  }
}
```

| Class | When |
| --- | --- |
| `TrendyolBadRequestError` | 400 — validation failed; read `.details` |
| `TrendyolAuthenticationError` | 401 — wrong API key/secret |
| `TrendyolAuthorizationError` | 403 — no access to that seller or resource |
| `TrendyolNotFoundError` | 404 |
| `TrendyolConflictError` | 409 — e.g. package already past that status |
| `TrendyolRateLimitError` | 429 — carries `.retryAfterMs` |
| `TrendyolServerError` | 5xx — safe to retry idempotent calls |
| `TrendyolApiError` | any other non-2xx; the base of all of the above |
| `TrendyolConnectionError` | never reached Trendyol (DNS, TLS, offline) |
| `TrendyolTimeoutError` | timed out or aborted |
| `TrendyolParseError` | 2xx that was not the JSON the endpoint promises |

## Async writes

Catalogue writes are asynchronous. They return a `batchRequestId`, not a result:

```ts
const { batchRequestId } = await trendyol.products.create({ items: [/* … */] });

await sleep(30_000); // Trendyol needs a moment
const result = await trendyol.batchRequests.result(batchRequestId!);

for (const item of result.items ?? []) {
  if (item.status === 'FAILED') console.error(item.failureReasons);
}
```

## Extending

The pipeline is `resource → transport → middleware → HttpClient`, and every arrow is an interface.
Retries are deliberately not built in — here is the whole of one:

```ts
import type { Middleware } from 'trendyol-sdk';

const retry: Middleware = {
  name: 'retry',
  async handle(request, next) {
    for (let attempt = 1; ; attempt++) {
      const response = await next({ ...request, context: { ...request.context, attempt } });
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === 3) return response;
      await sleep(2 ** attempt * 500);
    }
  },
};

new TrendyolClient({ /* … */ middleware: [retry] });
```

Testing works the same way — implement `HttpClient` and no network is involved:

```ts
class StubHttpClient implements HttpClient {
  async send(request: HttpRequest): Promise<HttpResponse> {
    return { status: 200, statusText: 'OK', headers: {}, body: '{"content":[]}' };
  }
}

const trendyol = new TrendyolClient({ sellerId: 1, apiKey: 'k', apiSecret: 's', httpClient: new StubHttpClient() });
```

## Endpoints Trendyol ships before this SDK does

`client.request()` runs an arbitrary call through the same authenticated, middleware-wrapped pipeline,
so a brand-new endpoint never blocks you on a release:

```ts
const result = await trendyol.request<{ id: number }>({
  operationId: 'someNewEndpoint',
  method: 'POST',
  path: '/order/sellers/{sellerId}/brand-new-thing',
  pathParams: { sellerId: trendyol.config.sellerId },
  body: { hello: 'world' },
});
```

## How current are the types?

Trendyol's published specs are **behind the running API**. Verified against production on
2026-08-24 with a live seller account: of the 34 read-only endpoints, 31 were reachable and
**19 returned fields the specs never describe** — 103 corrections in total, including two fields
the spec types as `string` that the API returns as `number` (`shipmentNumber`,
`cargoTrackingNumber`).

Those corrections live in [`openapi/overlays/`](./openapi/overlays) as JSON Merge Patches applied at
codegen time, so `npm run specs:fetch` can overwrite the specs without losing them. Fields that came
from observation rather than documentation say so in their JSDoc:

```ts
/** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
invoiceNumber?: string;
```

[`openapi/verification.json`](./openapi/verification.json) records exactly what was checked and when.

### Two documentation traps found this way

- **`turkeyDistricts` / `turkeyNeighborhoods` / `azerbaijanDistricts` take the city's `id`, not its
  `code`** — despite the path parameter being spelled `{CityCode}`. Passing the documented `code`
  answers `500`. The SDK names the parameter `cityId` and says so in its JSDoc.
- **`getBrands` ignores `size`** and always returns 1000 brands per page. `page` works.

## Keeping up with the API

```bash
npm run specs:fetch    # re-scrape openapi/*.json from developers.trendyol.com
npm run generate       # openapi/*.json + overlays -> src/generated/*.ts
npm test               # fails if an endpoint was added, removed, renamed or re-routed
```

`tests/spec-coverage.test.ts` compares every documented operation against what the resource classes
actually call — method and path included. A Trendyol change that would otherwise slip through as a
silent 404 becomes a failing test instead.

### Re-checking the types against the live API

```bash
TRENDYOL_SELLER_ID=… TRENDYOL_API_KEY=… TRENDYOL_API_SECRET=… npm run observe          # dry run
TRENDYOL_SELLER_ID=… TRENDYOL_API_KEY=… TRENDYOL_API_SECRET=… npm run observe -- --write
```

Every probe is read-only, and only field names and types are recorded — never values — so nothing
from a seller's account reaches the repository.

### The 46 endpoints probes cannot reach

Probing covers read-only endpoints. Writes, and the three reads that need an id only a write
produces (`getBatchRequestResult`, `getCommonLabel`, `getCargoInvoiceItems`), stay unverified that
way. For those, check the traffic instead of generating it:

```ts
import { TrendyolClient } from 'trendyol-sdk';
import { createDriftMiddleware, loadSpecDocuments } from 'trendyol-sdk/drift';

const client = new TrendyolClient({
  // …
  middleware: [createDriftMiddleware({ documents: loadSpecDocuments(), logger: console })],
});
// warn: schema drift in updatePackageStatus (2 finding(s))
//       undocumented-field result.warnings: array
```

Every response your integration actually receives gets compared against the committed schema, writes
included. Findings carry field names and types only, so it is safe to leave on in staging — keep it
off in production, where it parses each body a second time. `trendyol-sdk/drift` is a separate entry
point and Node-only; the main bundle never pulls in `node:fs`.

## Architecture

```
src/
├─ client.ts              TrendyolClient — composition root, lazy resource getters
├─ config.ts              options, validation, environment resolution
├─ core/
│  ├─ http/               HttpClient interface + fetch implementation + FormData
│  ├─ auth/               Authenticator interface + Basic auth
│  ├─ middleware/         pipeline, Middleware interface, logging
│  ├─ errors/             error hierarchy + status→class factory
│  ├─ url/                path templating, query serialisation
│  ├─ resource/           BaseResource, RequestOptions
│  └─ transport.ts        URL building, auth, pipeline, status mapping, JSON decoding
├─ drift/                 spec-vs-reality comparison; `trendyol-sdk/drift` entry point
├─ generated/             types generated from openapi/ + overlays — never edited by hand
└─ resources/             one class per documented tag; thin, typed, JSDoc'd

openapi/
├─ *.json                 Trendyol's published specs, refreshed by `specs:fetch`
├─ overlays/*.json        what production returns that the specs omit or mistype
└─ verification.json      which endpoints were checked against the live API, and when
```

Each layer depends only on the interface below it, which is what makes the transport swappable, the
resources unit-testable, and a new endpoint a one-method change.

## Notes and assumptions

- **Array query parameters** are sent comma-joined (`?shipmentPackageIds=1,2,3`), matching Trendyol's
  documentation. The specs do not declare a `style`, so if an endpoint disagrees, switch the client to
  `arrayFormat: 'repeat'`.
- **`int64` ids are typed `number`.** Trendyol's ids sit far below `Number.MAX_SAFE_INTEGER`; nothing
  in the API returns a value that would lose precision today.
- **Overlay fields come from one seller's production data.** A field that account never exercises is
  still missing here. Run `npm run observe` against your own account to extend the overlays; enum
  values are deliberately never widened from observation, since one account cannot prove the full set.
- **Timestamps are Unix milliseconds**, as Trendyol sends them. Date objects passed as query values are
  converted for you.
- **Test-order endpoints are stage-only** — construct the client with `environment: 'stage'`.
- **Header names are lower-cased** before being sent. Trendyol spells the same header `storefrontcode`
  and `storeFrontCode` in different places; HTTP treats them as one.

## Endpoint map

### `client.orders` — Order packages — listing them and moving them through their lifecycle.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `orders.list()` | `GET /order/sellers/{sellerId}/orders` | `getShipmentPackages` |
| `orders.listStream()` | `GET /order/sellers/{sellerId}/orders/stream` | `getShipmentPackagesStream` |
| `orders.updateStatus()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}` | `updatePackageStatus` |
| `orders.cancelItems()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/items/unsupplied` | `cancelOrderPackageItem` |
| `orders.updateBoxInfo()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/box-info` | `updateBoxInfo` |
| `orders.deliverByService()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/delivered-by-service` | `deliveredByService` |
| `orders.changeCargoProvider()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/cargo-providers` | `changeCargoProvider` |
| `orders.updateWarehouse()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/warehouse` | `updateWarehouse` |
| `orders.extendAgreedDeliveryDate()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/extended-agreed-delivery-date` | `extendAgreedDeliveryDate` |
| `orders.updateLaborCosts()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/labor-costs` | `updateLaborCosts` |

### `client.products` — The product catalogue: creating listings, filtering them, retiring them.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `products.create()` | `POST /product/sellers/{sellerId}/v2/products` | `createProducts` |
| `products.getByBarcode()` | `GET /product/sellers/{sellerId}/product/{barcode}` | `getProductBase` |
| `products.listUnapproved()` | `GET /product/sellers/{sellerId}/products/unapproved` | `filterUnapprovedProducts` |
| `products.listApproved()` | `GET /product/sellers/{sellerId}/products/approved` | `filterApprovedProducts` |
| `products.listApprovedInventoryAndPrice()` | `GET /product/sellers/{sellerId}/products/approved/inventory-and-price` | `filterApprovedProductsInventoryAndPrice` |
| `products.delete()` | `DELETE /product/sellers/{sellerId}/products` | `deleteProducts` |
| `products.setArchiveState()` | `PUT /product/sellers/{sellerId}/products/archive-state` | `archiveProducts` |
| `products.buyboxInformation()` | `POST /product/sellers/{sellerId}/products/buybox-information` | `getBuyboxInformation` |
| `products.unlock()` | `PUT /product/sellers/{sellerId}/products/unlock` | `unlockProducts` |

### `client.addresses` — Address reference data: countries, cities, districts, neighbourhoods.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `addresses.countries()` | `GET /member/countries` | `getCountries` |
| `addresses.cities()` | `GET /member/countries/{CountryCode}/cities` | `getCitiesByCountry` |
| `addresses.districts()` | `GET /member/countries/{CountryCode}/cities/{cityId}/districts` | `getDistrictsByCity` |
| `addresses.turkeyCities()` | `GET /member/countries/domestic/TR/cities` | `getTurkeyCities` |
| `addresses.turkeyDistricts()` | `GET /member/countries/domestic/TR/cities/{CityCode}/districts` | `getTurkeyDistricts` |
| `addresses.turkeyNeighborhoods()` | `GET /member/countries/domestic/TR/cities/{CityCode}/districts/{DistrictCode}/neighborhoods` | `getTurkeyNeighborhoods` |
| `addresses.azerbaijanCities()` | `GET /member/countries/domestic/AZ/cities` | `getAzerbaijanCities` |
| `addresses.azerbaijanDistricts()` | `GET /member/countries/domestic/AZ/cities/{cityCode}/districts` | `getAzerbaijanDistricts` |

### `client.claims` — Returns (claims) — listing them, approving them, objecting to them.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `claims.list()` | `GET /order/sellers/{sellerId}/claims` | `getClaims` |
| `claims.create()` | `POST /order/sellers/{sellerId}/claims/create` | `createClaim` |
| `claims.approveItems()` | `PUT /order/sellers/{sellerId}/claims/{claimId}/items/approve` | `approveClaimLineItems` |
| `claims.createIssue()` | `POST /order/sellers/{sellerId}/claims/{claimId}/issue` | `createClaimIssue` |
| `claims.issueReasons()` | `GET /order/claim-issue-reasons` | `getClaimIssueReasons` |
| `claims.itemAudits()` | `GET /order/sellers/{sellerId}/claims/items/{claimItemsId}/audit` | `getClaimItemAudits` |

### `client.deliveries` — Deliveries that bypass the standard cargo flow.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `deliveries.processAlternative()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery` | `processAlternativeDelivery` |
| `deliveries.processAlternativeDigital()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery-digital` | `processAlternativeDeliveryDigital` |
| `deliveries.markDelivered()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/manual-invoice-delivery` | `manualDeliverByPackageId` |
| `deliveries.markDeliveredByTrackingNumber()` | `PUT /order/sellers/{sellerId}/shipment-packages/manual-invoice-delivery-by-tracking-number/{cargoTrackingNumber}` | `manualDeliverByTrackingNumber` |
| `deliveries.markReturned()` | `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/manual-return` | `manualReturnByPackageId` |
| `deliveries.markReturnedByTrackingNumber()` | `PUT /order/sellers/{sellerId}/shipment-packages/manual-return-by-tracking-number/{cargoTrackingNumber}` | `manualReturnByTrackingNumber` |

### `client.webhooks` — The webhook service is mounted under its own prefix on the gateway; the spec's

| Method | Endpoint | operationId |
| --- | --- | --- |
| `webhooks.create()` | `POST /webhook/sellers/{sellerId}/webhooks` | `createWebhook` |
| `webhooks.list()` | `GET /webhook/sellers/{sellerId}/webhooks` | `getWebhooks` |
| `webhooks.update()` | `PUT /webhook/sellers/{sellerId}/webhooks/{Id}` | `updateWebhook` |
| `webhooks.delete()` | `DELETE /webhook/sellers/{sellerId}/webhooks/{Id}` | `deleteWebhook` |
| `webhooks.activate()` | `PUT /webhook/sellers/{sellerId}/webhooks/{Id}/activate` | `activateWebhook` |
| `webhooks.deactivate()` | `PUT /webhook/sellers/{sellerId}/webhooks/{Id}/deactivate` | `deactivateWebhook` |

### `client.productUpdates` — Bulk edits to existing listings.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `productUpdates.unapproved()` | `POST /product/sellers/{sellerId}/products/unapproved-bulk-update` | `updateUnapprovedProducts` |
| `productUpdates.content()` | `POST /product/sellers/{sellerId}/products/content-bulk-update` | `updateContentBulk` |
| `productUpdates.variants()` | `POST /product/sellers/{sellerId}/products/variant-bulk-update` | `updateVariantBulk` |
| `productUpdates.deliveryInfo()` | `POST /product/sellers/{sellerId}/products/delivery-info-bulk-update` | `updateDeliveryInfoBulk` |
| `productUpdates.audits()` | `GET /product/sellers/{sellerId}/products/{contentId}/update-audits` | `getUpdateAudits` |

### `client.packageSplits` — Splitting a package when part of it cannot ship together.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `packageSplits.byLines()` | `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/split` | `splitShipmentPackage` |
| `packageSplits.byQuantity()` | `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/quantity-split` | `splitShipmentPackageByQuantity` |
| `packageSplits.multiByQuantity()` | `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/split-packages` | `splitMultiPackagesByQuantity` |
| `packageSplits.multi()` | `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/multi-split` | `multiSplitShipmentPackage` |

### `client.questions` — Customer questions on product pages.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `questions.list()` | `GET /qna/sellers/{sellerId}/questions/filter` | `getQuestionFilter` |
| `questions.get()` | `GET /qna/sellers/{sellerId}/questions/{id}` | `getQuestion` |
| `questions.answer()` | `POST /qna/sellers/{sellerId}/questions/{id}/answers` | `answerQuestion` |
| `questions.create()` | `POST /qna/sellers/{sellerId}/questions` | `createQuestion` |

### `client.brands` — Brands: listing, searching, and requesting a new one.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `brands.list()` | `GET /product/brands` | `getBrands` |
| `brands.searchByName()` | `GET /product/brands/by-name` | `getBrandsByName` |
| `brands.create()` | `POST /product/sellers/{sellerId}/brands` | `createBrand` |

### `client.categories` — The category tree and the attributes each category demands.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `categories.tree()` | `GET /product/product-categories` | `getCategoryTree` |
| `categories.attributes()` | `GET /product/categories/{categoryId}/attributes` | `getCategoryAttributes` |
| `categories.attributeValues()` | `GET /product/categories/{categoryId}/attributes/{attributeId}/values` | `getCategoryAttributeValues` |

### `client.finance` — The finance services sit behind their own gateway prefix

| Method | Endpoint | operationId |
| --- | --- | --- |
| `finance.settlements()` | `GET /finance/che/sellers/{sellerId}/settlements` | `getSettlements` |
| `finance.otherFinancials()` | `GET /finance/che/sellers/{sellerId}/otherfinancials` | `getOtherFinancials` |
| `finance.cargoInvoiceItems()` | `GET /finance/che/sellers/{sellerId}/cargo-invoice/{invoiceSerialNumber}/items` | `getCargoInvoiceItems` |

### `client.invoices` — Customer invoices: sending a link, revoking it, or uploading the file itself.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `invoices.sendLink()` | `POST /sellers/{sellerId}/seller-invoice-links` | `sendInvoiceLink` |
| `invoices.deleteLink()` | `POST /sellers/{sellerId}/seller-invoice-links/delete` | `deleteInvoiceLink` |
| `invoices.uploadFile()` | `POST /sellers/{sellerId}/seller-invoice-file` | `uploadInvoiceFile` |

### `client.testOrders` — Fabricating orders on the stage environment.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `testOrders.create()` | `POST /test/order/orders/core` | `createTestOrder` |
| `testOrders.updateStatus()` | `PUT /test/order/sellers/{sellerId}/shipment-packages/{packageId}/status` | `updateTestOrderStatus` |
| `testOrders.claimToWaitingInAction()` | `PUT /test/order/sellers/{sellerId}/claims/waiting-in-action` | `updateTestClaimToWaitingInAction` |

### `client.commonLabels` — Common label barcodes — the shipping label Trendyol prints for a package.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `commonLabels.create()` | `POST /sellers/{sellerId}/common-label/{cargoTrackingNumber}` | `createCommonLabel` |
| `commonLabels.get()` | `GET /sellers/{sellerId}/common-label/{cargoTrackingNumber}` | `getCommonLabel` |

### `client.batchRequests` — Results of asynchronous catalogue writes.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `batchRequests.result()` | `GET /product/sellers/{sellerId}/products/batch-requests/{batchRequestId}` | `getBatchRequestResult` |

### `client.express` — Trendyol Express compensation tickets — claims for lost or damaged cargo.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `express.compensationTickets()` | `GET /tex/compensation/sellers/{sellerId}/tickets` | `getCompensationTickets` |

### `client.inventory` — Stock and price updates — the highest-traffic endpoint of the whole API.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `inventory.update()` | `POST /inventory/sellers/{sellerId}/products/price-and-inventory` | `updatePriceAndInventory` |

### `client.lookup` — Reference data shared across the catalogue and order APIs.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `lookup.cargoProviders()` | `GET /product/lookup/cargo-providers` | `getCargoProviders` |

### `client.supplierAddresses` — The seller's own addresses: warehouses, invoice and return addresses.

| Method | Endpoint | operationId |
| --- | --- | --- |
| `supplierAddresses.list()` | `GET /sellers/{sellerId}/addresses` | `getSuppliersAddresses` |


## Licence

MIT
