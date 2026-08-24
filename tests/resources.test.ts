import { describe, expect, it } from 'vitest';
import { createTestClient } from './support/client.js';

describe('resources', () => {
  it('serialises order filters, arrays included', async () => {
    const { client, http } = createTestClient();
    await client.orders.list({
      status: 'Created',
      startDate: 1_700_000_000_000,
      shipmentPackageIds: [11, 22],
      size: 50,
    });

    const { url } = http.lastCall;
    expect(url.searchParams.get('status')).toBe('Created');
    expect(url.searchParams.get('startDate')).toBe('1700000000000');
    expect(url.searchParams.get('shipmentPackageIds')).toBe('11,22');
    expect(url.searchParams.get('size')).toBe('50');
  });

  it('routes webhook calls through the /webhook prefix', async () => {
    const { client, http } = createTestClient();
    await client.webhooks.deactivate('wh-1');

    expect(http.lastCall.request.method).toBe('PUT');
    expect(http.lastCall.url.pathname).toBe('/integration/webhook/sellers/123456/webhooks/wh-1/deactivate');
  });

  it('routes finance calls through the /finance/che prefix', async () => {
    const { client, http } = createTestClient();
    await client.finance.settlements({
      startDate: 1_700_000_000_000,
      endDate: 1_700_600_000_000,
      transactionType: 'Sale',
    });

    expect(http.lastCall.url.pathname).toBe('/integration/finance/che/sellers/123456/settlements');
  });

  it('translates storefront options into headers', async () => {
    const { client, http } = createTestClient();
    await client.categories.tree({ name: 'ayakkabı' }, { storefrontCode: 'AZ', acceptLanguage: 'en' });

    const { request, url } = http.lastCall;
    expect(request.headers['storefrontcode']).toBe('AZ');
    expect(request.headers['accept-language']).toBe('en');
    expect(url.searchParams.get('name')).toBe('ayakkabı');
  });

  it('sends claim objections as multipart with attachments', async () => {
    const { client, http } = createTestClient();
    await client.claims.createIssue(555, {
      claimIssueReasonId: 1,
      claimItemIdList: '10,11',
      description: 'Product returned damaged',
      files: [{ data: 'jpeg-bytes', filename: 'photo.jpg', contentType: 'image/jpeg' }],
    });

    const body = http.lastCall.request.body as FormData;
    expect(http.lastCall.url.pathname).toBe('/integration/order/sellers/123456/claims/555/issue');
    expect(body.get('claimItemIdList')).toBe('10,11');
    expect(body.get('files')).toBeInstanceOf(Blob);
  });

  it('adds the sellerID header test orders require', async () => {
    const { client, http } = createTestClient({ environment: 'stage' });
    await client.testOrders.updateStatus(77, { status: 'Shipped', lines: [{ lineId: 1, quantity: 1 }] });

    expect(http.lastCall.request.headers['sellerid']).toBe('123456');
  });

  it('lets per-call headers override the defaults', async () => {
    const { client, http } = createTestClient({ defaultHeaders: { 'x-trace': 'default' } });
    await client.products.listApproved({}, { headers: { 'x-trace': 'per-call' } });

    expect(http.lastCall.request.headers['x-trace']).toBe('per-call');
  });

  it('reuses one instance per resource', () => {
    const { client } = createTestClient();
    expect(client.orders).toBe(client.orders);
  });

  it('forwards an abort signal to the transport', async () => {
    const { client, http } = createTestClient();
    const controller = new AbortController();
    await client.lookup.cargoProviders({ signal: controller.signal });

    expect(http.lastCall.request.signal).toBe(controller.signal);
  });
});
