import type { Authenticator } from './auth/index.js';
import { createApiError, TrendyolParseError } from './errors/index.js';
import type { HttpClient, HttpHeaders, HttpMethod, HttpRequest, HttpResponse } from './http/index.js';
import { composeMiddleware, type Middleware } from './middleware/index.js';
import { expandPath, joinUrl, serializeQuery, type ArrayFormat, type PathParams, type QueryParams } from './url/index.js';

/** One API call, described the way the OpenAPI document describes it. */
export interface OperationRequest {
  /** OpenAPI `operationId`; shows up in logs and errors. */
  operationId: string;
  method: HttpMethod;
  /** Path template with `{placeholders}`, copied from the spec. */
  path: string;
  pathParams?: PathParams;
  query?: QueryParams;
  /** Serialised as JSON unless it is already a `FormData`. */
  body?: unknown;
  headers?: HttpHeaders;
  signal?: AbortSignal;
  /** Values forwarded to middleware through `request.context.meta`. */
  meta?: Record<string, unknown>;
}

export interface TransportOptions {
  baseUrl: string;
  httpClient: HttpClient;
  authenticator: Authenticator;
  middleware?: readonly Middleware[];
  defaultHeaders?: HttpHeaders;
  arrayFormat?: ArrayFormat;
  userAgent: string;
}

/**
 * Turns an {@link OperationRequest} into an HTTP call and back into a typed value.
 *
 * This is the only place that knows how a Trendyol call is assembled: URL
 * building, auth, the middleware chain, status-to-error mapping and JSON
 * parsing. Resources describe *what* to call; the transport decides *how*.
 */
export class Transport {
  private readonly baseUrl: string;
  private readonly httpClient: HttpClient;
  private readonly authenticator: Authenticator;
  private readonly middleware: readonly Middleware[];
  private readonly defaultHeaders: HttpHeaders;
  private readonly arrayFormat: ArrayFormat;
  private readonly userAgent: string;

  constructor(options: TransportOptions) {
    this.baseUrl = options.baseUrl;
    this.httpClient = options.httpClient;
    this.authenticator = options.authenticator;
    this.middleware = options.middleware ?? [];
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.arrayFormat = options.arrayFormat ?? 'comma';
    this.userAgent = options.userAgent;
  }

  /** Execute an operation and decode its JSON body as `TResponse`. */
  async request<TResponse>(operation: OperationRequest): Promise<TResponse> {
    const response = await this.send(operation);
    return this.decode<TResponse>(operation, response);
  }

  /**
   * Execute an operation and return the raw response.
   *
   * Non-2xx statuses still throw; use this when an endpoint returns something
   * other than JSON, or when response headers matter.
   */
  async send(operation: OperationRequest): Promise<HttpResponse> {
    const request = this.buildRequest(operation);
    const authenticated = await this.authenticator.authenticate(request);

    const run = composeMiddleware(this.middleware, (req) => this.httpClient.send(req));
    const response = await run(authenticated);

    if (response.status < 200 || response.status >= 300) {
      throw createApiError(authenticated, response);
    }
    return response;
  }

  private buildRequest(operation: OperationRequest): HttpRequest {
    const path = expandPath(operation.path, operation.pathParams, operation.operationId);
    const queryString = serializeQuery(operation.query, this.arrayFormat);
    const url = joinUrl(this.baseUrl, path) + (queryString ? `?${queryString}` : '');

    const isFormData = typeof FormData !== 'undefined' && operation.body instanceof FormData;
    const hasBody = operation.body !== undefined && operation.body !== null;

    const headers: HttpHeaders = {
      accept: 'application/json',
      'user-agent': this.userAgent,
      ...lowerCaseKeys(this.defaultHeaders),
      ...lowerCaseKeys(operation.headers ?? {}),
    };
    // `fetch` must set the multipart boundary itself, so never force a type there.
    if (hasBody && !isFormData && !headers['content-type']) {
      headers['content-type'] = 'application/json';
    }

    return {
      method: operation.method,
      url,
      headers,
      body: hasBody ? (isFormData ? (operation.body as FormData) : JSON.stringify(operation.body)) : undefined,
      signal: operation.signal,
      context: {
        operationId: operation.operationId,
        pathTemplate: operation.path,
        attempt: 1,
        meta: operation.meta ?? {},
      },
    };
  }

  private decode<TResponse>(operation: OperationRequest, response: HttpResponse): TResponse {
    const body = response.body?.trim() ?? '';
    // 204, or an endpoint that answers with an empty 200 — both mean "no value".
    if (!body || response.status === 204) return undefined as TResponse;

    const contentType = response.headers['content-type'] ?? '';
    if (contentType && !contentType.includes('json')) return body as unknown as TResponse;

    try {
      return JSON.parse(body) as TResponse;
    } catch (cause) {
      throw new TrendyolParseError(
        `${operation.operationId} returned a ${response.status} that is not valid JSON`,
        {
          operationId: operation.operationId,
          method: operation.method,
          url: `${this.baseUrl}${operation.path}`,
          status: response.status,
          body: body.slice(0, 2000),
        },
        { cause }
      );
    }
  }
}

function lowerCaseKeys(headers: HttpHeaders): HttpHeaders {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
}
