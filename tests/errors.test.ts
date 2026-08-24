import { describe, expect, it } from 'vitest';
import {
  createApiError,
  TrendyolApiError,
  TrendyolAuthenticationError,
  TrendyolNotFoundError,
  TrendyolRateLimitError,
  TrendyolServerError,
  type HttpRequest,
  type HttpResponse,
} from '../src/index.js';

const request = {
  method: 'GET',
  url: 'https://apigw.trendyol.com/integration/order/sellers/1/orders',
  headers: {},
  context: { operationId: 'getShipmentPackages', pathTemplate: '/order/sellers/{sellerId}/orders', attempt: 1, meta: {} },
} as HttpRequest;

const respond = (status: number, body = '', headers: Record<string, string> = {}): HttpResponse => ({
  status,
  statusText: 'Error',
  headers,
  body,
});

describe('createApiError', () => {
  it('maps statuses to specific classes', () => {
    expect(createApiError(request, respond(401))).toBeInstanceOf(TrendyolAuthenticationError);
    expect(createApiError(request, respond(404))).toBeInstanceOf(TrendyolNotFoundError);
    expect(createApiError(request, respond(503))).toBeInstanceOf(TrendyolServerError);
  });

  it('falls back to the base class for unmapped 4xx', () => {
    const error = createApiError(request, respond(418));
    expect(error).toBeInstanceOf(TrendyolApiError);
    expect(error.status).toBe(418);
  });

  it('surfaces Trendyol validation messages', () => {
    const error = createApiError(
      request,
      respond(400, JSON.stringify({ errors: [{ key: 'barcode', message: 'Barcode already exists' }] }))
    );
    expect(error.details).toEqual(['Barcode already exists']);
    expect(error.message).toContain('Barcode already exists');
  });

  it('reads Retry-After on 429', () => {
    const error = createApiError(request, respond(429, '', { 'retry-after': '30' })) as TrendyolRateLimitError;
    expect(error).toBeInstanceOf(TrendyolRateLimitError);
    expect(error.retryAfterMs).toBe(30_000);
  });

  it('survives a non-JSON error body', () => {
    const error = createApiError(request, respond(500, '<html>gateway</html>'));
    expect(error.details).toEqual([]);
    expect(error.context.body).toContain('gateway');
  });

  it('keeps the operation id for logging', () => {
    expect(createApiError(request, respond(400)).context.operationId).toBe('getShipmentPackages');
  });
});
