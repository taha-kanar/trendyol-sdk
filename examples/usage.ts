/**
 * The snippets from README.md, kept compiling.
 *
 * `npm run typecheck` includes this file, so an example that drifts out of date
 * with the generated types breaks the build instead of misleading a reader.
 */
import {
  TrendyolClient,
  TrendyolError,
  TrendyolNotFoundError,
  TrendyolRateLimitError,
  type HttpClient,
  type HttpRequest,
  type HttpResponse,
  type Middleware,
} from '../src/index.js';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// --- Quick start -------------------------------------------------------------

const trendyol = new TrendyolClient({
  sellerId: 123456,
  apiKey: process.env.TRENDYOL_API_KEY!,
  apiSecret: process.env.TRENDYOL_API_SECRET!,
  integrator: 'AcmeCommerce',
});

export async function pickNewOrders(): Promise<void> {
  const page = await trendyol.orders.list({ status: 'Created', size: 50 });

  for (const pkg of page.content ?? []) {
    await trendyol.orders.updateStatus(pkg.id!, { status: 'Picking' });
  }
}

// --- Errors ------------------------------------------------------------------

export async function updateStock(): Promise<void> {
  try {
    await trendyol.inventory.update({ items: [{ barcode: 'ACME-1', quantity: 12 }] });
  } catch (error) {
    if (error instanceof TrendyolRateLimitError) {
      await sleep(error.retryAfterMs ?? 60_000);
    } else if (error instanceof TrendyolNotFoundError) {
      console.warn('gone:', error.details);
    } else if (error instanceof TrendyolError) {
      console.error(error.context.operationId, error.context.status, error.context.requestId);
    }
  }
}

// --- Async writes ------------------------------------------------------------

export async function createAndPoll(): Promise<void> {
  const { batchRequestId } = await trendyol.products.create({ items: [] });

  await sleep(30_000);
  const result = await trendyol.batchRequests.result(batchRequestId!);

  for (const item of result.items ?? []) {
    if (item.status === 'FAILED') console.error(item.failureReasons);
  }
}

// --- Middleware --------------------------------------------------------------

export const retry: Middleware = {
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

// --- Testing seam ------------------------------------------------------------

export class StubHttpClient implements HttpClient {
  async send(_request: HttpRequest): Promise<HttpResponse> {
    return { status: 200, statusText: 'OK', headers: {}, body: '{"content":[]}' };
  }
}

export const stubbed = new TrendyolClient({
  sellerId: 1,
  apiKey: 'k',
  apiSecret: 's',
  httpClient: new StubHttpClient(),
  middleware: [retry],
});

// --- Escape hatch ------------------------------------------------------------

export function callUndocumentedEndpoint(): Promise<{ id: number }> {
  return trendyol.request<{ id: number }>({
    operationId: 'someNewEndpoint',
    method: 'POST',
    path: '/order/sellers/{sellerId}/brand-new-thing',
    pathParams: { sellerId: trendyol.config.sellerId },
    body: { hello: 'world' },
  });
}
