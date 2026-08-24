import { withHeaders } from '../http/types.js';
import type { HttpRequest } from '../http/types.js';
import { encodeBase64 } from './base64.js';
import type { Authenticator } from './authenticator.js';

/**
 * HTTP Basic auth with the seller's API key and secret.
 *
 * Credentials come from Seller Panel → Hesabım → Entegrasyon Bilgilerim.
 * The header is computed once in the constructor; nothing re-encodes per call.
 */
export class BasicAuthenticator implements Authenticator {
  private readonly header: string;

  constructor(apiKey: string, apiSecret: string) {
    this.header = `Basic ${encodeBase64(`${apiKey}:${apiSecret}`)}`;
  }

  authenticate(request: HttpRequest): HttpRequest {
    return withHeaders(request, { authorization: this.header });
  }
}
