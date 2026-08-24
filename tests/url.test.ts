import { describe, expect, it } from 'vitest';
import { expandPath, joinUrl, serializeQuery, TrendyolError } from '../src/index.js';

describe('expandPath', () => {
  it('substitutes and URL-encodes placeholders', () => {
    expect(expandPath('/order/sellers/{sellerId}/orders', { sellerId: 42 })).toBe('/order/sellers/42/orders');
    expect(expandPath('/common-label/{n}', { n: 'TR 12/34' })).toBe('/common-label/TR%2012%2F34');
  });

  it('throws instead of building a path with a missing id', () => {
    expect(() => expandPath('/orders/{packageId}', {}, 'updatePackageStatus')).toThrow(TrendyolError);
    expect(() => expandPath('/orders/{packageId}', { packageId: '' })).toThrow(/Missing path parameter/);
  });
});

describe('joinUrl', () => {
  it('normalises the separator', () => {
    expect(joinUrl('https://api.test/integration/', '/order/x')).toBe('https://api.test/integration/order/x');
    expect(joinUrl('https://api.test/integration', 'order/x')).toBe('https://api.test/integration/order/x');
  });
});

describe('serializeQuery', () => {
  it('drops undefined and null so optional filters are not sent blank', () => {
    expect(serializeQuery({ page: 0, status: undefined, orderNumber: null })).toBe('page=0');
  });

  it('keeps falsy values that are meaningful', () => {
    expect(serializeQuery({ page: 0, required: false })).toBe('page=0&required=false');
  });

  it('joins arrays with commas by default', () => {
    expect(serializeQuery({ shipmentPackageIds: [1, 2, 3] })).toBe('shipmentPackageIds=1%2C2%2C3');
  });

  it('repeats keys when asked', () => {
    expect(serializeQuery({ ids: [1, 2] }, 'repeat')).toBe('ids=1&ids=2');
  });

  it('skips empty arrays and converts dates to epoch milliseconds', () => {
    expect(serializeQuery({ ids: [], startDate: new Date(1_700_000_000_000) })).toBe('startDate=1700000000000');
  });
});
