import type { HttpRequest } from '../http/types.js';

/**
 * Adds credentials to an outgoing request.
 *
 * Trendyol uses HTTP Basic today. Keeping it behind an interface means a future
 * scheme (token exchange, mTLS proxy, a vault lookup) is a new class rather than
 * an edit to the transport.
 */
export interface Authenticator {
  authenticate(request: HttpRequest): HttpRequest | Promise<HttpRequest>;
}
