/** HTTP verbs used by the Trendyol API. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/** Case-insensitive header bag, normalised to lower-case keys by the transport. */
export type HttpHeaders = Record<string, string>;

/**
 * A fully-resolved request, ready to be handed to an {@link HttpClient}.
 *
 * Everything is already decided at this point: absolute URL, serialised body,
 * final headers. Middleware may clone and modify it, nothing else.
 */
export interface HttpRequest {
  readonly method: HttpMethod;
  /** Absolute URL, query string included. */
  readonly url: string;
  readonly headers: HttpHeaders;
  /** Serialised payload, or `undefined` for body-less requests. */
  readonly body?: string | FormData | undefined;
  readonly signal?: AbortSignal | undefined;
  /** Free-form, per-request metadata for middleware. Never sent over the wire. */
  readonly context: RequestContext;
}

/** Metadata carried alongside a request so middleware can reason about it. */
export interface RequestContext {
  /** OpenAPI `operationId`, e.g. `getShipmentPackages`. */
  readonly operationId: string;
  /** Un-expanded path template, e.g. `/order/sellers/{sellerId}/orders`. */
  readonly pathTemplate: string;
  /** Attempt number, starting at 1. Incremented by retrying middleware. */
  attempt: number;
  /** Arbitrary values attached by callers or middleware. */
  readonly meta: Record<string, unknown>;
}

/** A response with its body already buffered as text. */
export interface HttpResponse {
  readonly status: number;
  readonly statusText: string;
  readonly headers: HttpHeaders;
  /** Raw response body. Empty string for `204 No Content`. */
  readonly body: string;
  /** Platform response object, when the client exposes one (e.g. `Response`). */
  readonly raw?: unknown;
}

/** Create a shallow copy of a request with some fields replaced. */
export function withRequest(request: HttpRequest, patch: Partial<Omit<HttpRequest, 'context'>>): HttpRequest {
  return { ...request, ...patch };
}

/** Create a copy of a request with extra headers merged in (later wins). */
export function withHeaders(request: HttpRequest, headers: HttpHeaders): HttpRequest {
  return withRequest(request, { headers: { ...request.headers, ...headers } });
}
