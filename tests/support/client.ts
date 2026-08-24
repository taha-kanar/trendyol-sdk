import { TrendyolClient } from '../../src/index.js';
import { MockHttpClient } from './mock-http-client.js';

/** A client wired to a {@link MockHttpClient}, with credentials that never leave the process. */
export function createTestClient(options: Partial<ConstructorParameters<typeof TrendyolClient>[0]> = {}): {
  client: TrendyolClient;
  http: MockHttpClient;
} {
  const http = new MockHttpClient();
  const client = new TrendyolClient({
    sellerId: 123456,
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    httpClient: http,
    ...options,
  } as ConstructorParameters<typeof TrendyolClient>[0]);
  return { client, http };
}
