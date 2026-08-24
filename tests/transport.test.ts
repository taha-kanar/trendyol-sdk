import { describe, expect, it, vi } from 'vitest';
import {
  BasicAuthenticator,
  encodeBase64,
  TrendyolNotFoundError,
  TrendyolParseError,
  type Middleware,
} from '../src/index.js';
import { createTestClient } from './support/client.js';

describe('transport', () => {
  it('signs requests with Basic auth and the required User-Agent', async () => {
    const { client, http } = createTestClient({ integrator: 'AcmeCommerce' });
    await client.orders.list();

    const { headers } = http.lastCall.request;
    expect(headers['authorization']).toBe(`Basic ${encodeBase64('test-key:test-secret')}`);
    expect(headers['user-agent']).toBe('123456 - AcmeCommerce');
    expect(headers['accept']).toBe('application/json');
  });

  it('defaults the integrator to SelfIntegration', async () => {
    const { client, http } = createTestClient();
    await client.orders.list();
    expect(http.lastCall.request.headers['user-agent']).toBe('123456 - SelfIntegration');
  });

  it('injects the seller id into paths', async () => {
    const { client, http } = createTestClient();
    await client.orders.list();
    expect(http.lastCall.url.pathname).toBe('/integration/order/sellers/123456/orders');
  });

  it('targets the stage gateway when asked', async () => {
    const { client, http } = createTestClient({ environment: 'stage' });
    await client.orders.list();
    expect(http.lastCall.url.origin).toBe('https://stageapigw.trendyol.com');
  });

  it('sends JSON bodies with a content-type', async () => {
    const { client, http } = createTestClient();
    await client.orders.updateStatus(998, { status: 'Picking', lines: [{ lineId: 1, quantity: 2 }] });

    const { request } = http.lastCall;
    expect(request.method).toBe('PUT');
    expect(request.headers['content-type']).toBe('application/json');
    expect(JSON.parse(request.body as string)).toEqual({ status: 'Picking', lines: [{ lineId: 1, quantity: 2 }] });
  });

  it('omits the body and content-type on body-less calls', async () => {
    const { client, http } = createTestClient();
    await client.deliveries.markDelivered(42);

    expect(http.lastCall.request.body).toBeUndefined();
    expect(http.lastCall.request.headers['content-type']).toBeUndefined();
  });

  it('leaves multipart boundaries to the runtime', async () => {
    const { client, http } = createTestClient();
    await client.invoices.uploadFile({
      shipmentPackageId: 5,
      file: { data: 'pdf-bytes', filename: 'invoice.pdf', contentType: 'application/pdf' },
    });

    const { request } = http.lastCall;
    expect(request.body).toBeInstanceOf(FormData);
    expect(request.headers['content-type']).toBeUndefined();
    expect((request.body as FormData).get('shipmentPackageId')).toBe('5');
  });

  it('parses JSON responses into the declared type', async () => {
    const { client, http } = createTestClient();
    http.enqueueJson({ page: 0, totalElements: 1, content: [{ id: 7, orderNumber: 'TY-1' }] });

    const page = await client.orders.list({ size: 1 });
    expect(page.content?.[0]?.orderNumber).toBe('TY-1');
  });

  it('returns undefined for 204 and empty bodies', async () => {
    const { client, http } = createTestClient();
    http.enqueue({ status: 204, body: '' });
    await expect(client.orders.deliverByService(1)).resolves.toBeUndefined();
  });

  it('throws a typed error for non-2xx responses', async () => {
    const { client, http } = createTestClient();
    http.enqueueJson({ errors: [{ message: 'Package not found' }] }, 404);

    await expect(client.orders.updateStatus(1, { status: 'Picking' })).rejects.toBeInstanceOf(TrendyolNotFoundError);
  });

  it('reports malformed JSON as a parse error, not a crash', async () => {
    const { client, http } = createTestClient();
    http.enqueue({ status: 200, body: '<html>', headers: { 'content-type': 'application/json' } });

    await expect(client.orders.list()).rejects.toBeInstanceOf(TrendyolParseError);
  });

  it('runs middleware outermost-first and can retry', async () => {
    const order: string[] = [];
    const trace = (name: string): Middleware => ({
      name,
      async handle(request, next) {
        order.push(`>${name}`);
        const response = await next(request);
        order.push(`<${name}`);
        return response;
      },
    });

    const { client, http } = createTestClient({ middleware: [trace('outer'), trace('inner')] });
    http.enqueueJson({ ok: true });
    await client.orders.list();

    expect(order).toEqual(['>outer', '>inner', '<inner', '<outer']);
    expect(http.calls).toHaveLength(1);
  });

  it('lets a custom authenticator replace Basic auth', async () => {
    const authenticator = {
      authenticate: vi.fn((request) => ({ ...request, headers: { ...request.headers, authorization: 'Bearer x' } })),
    };
    const { client, http } = createTestClient({ authenticator, apiKey: undefined, apiSecret: undefined });

    await client.orders.list();
    expect(authenticator.authenticate).toHaveBeenCalledOnce();
    expect(http.lastCall.request.headers['authorization']).toBe('Bearer x');
  });

  it('exposes an escape hatch for endpoints the SDK does not cover', async () => {
    const { client, http } = createTestClient();
    http.enqueueJson({ id: 1 });

    const result = await client.request<{ id: number }>({
      operationId: 'brandNewEndpoint',
      method: 'POST',
      path: '/order/sellers/{sellerId}/brand-new-thing',
      pathParams: { sellerId: client.config.sellerId },
      body: { hello: 'world' },
    });

    expect(result).toEqual({ id: 1 });
    expect(http.lastCall.url.pathname).toBe('/integration/order/sellers/123456/brand-new-thing');
  });
});

describe('configuration', () => {
  it('rejects a client without credentials', () => {
    expect(() => createTestClient({ apiKey: undefined, apiSecret: undefined })).toThrow(/apiKey/);
  });

  it('rejects a client without a seller id', () => {
    expect(() => createTestClient({ sellerId: '' })).toThrow(/sellerId/);
  });

  it('base64-encodes non-ASCII secrets correctly', () => {
    expect(new BasicAuthenticator('kullanıcı', 'şifre')).toBeInstanceOf(BasicAuthenticator);
    expect(encodeBase64('kullanıcı:şifre')).toBe(Buffer.from('kullanıcı:şifre', 'utf8').toString('base64'));
  });
});
