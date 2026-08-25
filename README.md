# trendyol-sdk

Typed TypeScript client for the **Trendyol Marketplace Integration API** — all 80 endpoints across
orders, returns, products, inventory, finance and webhooks.

> ### Unofficial
>
> This is **not** Trendyol's own SDK, and Trendyol did not write, review or endorse it. It is an
> independent community project, not affiliated with Trendyol in any way. The types are generated
> from Trendyol's published OpenAPI documents, but everything else here is third-party work — use
> it at your own risk, and treat Trendyol's own documentation as the authority when the two differ.

## Install

Not published to npm — install it from the repository:

```bash
npm install github:taha-kanar/trendyol-sdk
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

const page = await trendyol.orders.list({ status: 'Created', size: 50 });

for (const pkg of page.content ?? []) {
  await trendyol.orders.updateStatus(pkg.id!, { status: 'Picking' });
}
```

Credentials come from **Seller Panel → Hesabım → Entegrasyon Bilgilerim**.

## What it handles for you

- **The `User-Agent`.** Trendyol requires `"{sellerId} - {integrator}"` on every request and rejects
  anything else. Built from your config.
- **Zero runtime dependencies.** Platform `fetch` only — Node 18+, browsers, Deno, Bun, Workers.
- **Types generated from the specs**, committed under [`openapi/`](./openapi), with the corrections
  found against a live account recorded as overlays rather than edited into the generated code.
- **Async catalogue writes**, which return a batch id rather than a result.
- **Swappable seams.** Transport, auth and the middleware pipeline are interfaces.

Details live in the source, which is commented for exactly this: `src/resources/` for the endpoint
map, `openapi/overlays/` for where the specs and the live API disagree.

## Development

```bash
npm install
npm run generate    # specs → src/generated/
npm run typecheck
npm test
npm run build
```

## Licence

MIT
