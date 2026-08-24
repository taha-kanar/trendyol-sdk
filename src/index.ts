/**
 * trendyol-sdk — a typed client for the Trendyol Marketplace Integration API.
 *
 * Every request/response type under `./generated` is derived from Trendyol's
 * own OpenAPI documents (committed in `openapi/`), so the types track the
 * published contract rather than someone's reading of it.
 */

export { TrendyolClient } from './client.js';
export { BASE_URLS, type ClientOptions, type ResolvedConfig, type TrendyolEnvironment } from './config.js';

// Core seams — implement these to swap transport, auth or add pipeline steps.
export { BasicAuthenticator, encodeBase64, type Authenticator } from './core/auth/index.js';
export {
  FetchHttpClient,
  withHeaders,
  withRequest,
  type FetchHttpClientOptions,
  type FetchLike,
  type HttpClient,
  type HttpHeaders,
  type HttpMethod,
  type HttpRequest,
  type HttpResponse,
  type RequestContext,
} from './core/http/index.js';
export { toFormData, type FileInput, type FormFields } from './core/http/form-data.js';
export { composeMiddleware, LoggingMiddleware, type Middleware, type Next } from './core/middleware/index.js';
export { consoleLogger, silentLogger, type Logger } from './core/logger.js';
export { Transport, type OperationRequest, type TransportOptions } from './core/transport.js';
export { BaseResource, type RequestOptions } from './core/resource/base-resource.js';
export {
  expandPath,
  joinUrl,
  serializeQuery,
  type ArrayFormat,
  type PathParams,
  type QueryParams,
  type QueryValue,
} from './core/url/index.js';

// Errors — `TrendyolError` is the base of everything this package throws.
export {
  createApiError,
  TrendyolApiError,
  TrendyolAuthenticationError,
  TrendyolAuthorizationError,
  TrendyolBadRequestError,
  TrendyolConflictError,
  TrendyolConnectionError,
  TrendyolError,
  TrendyolNotFoundError,
  TrendyolParseError,
  TrendyolRateLimitError,
  TrendyolServerError,
  TrendyolTimeoutError,
  type TrendyolErrorContext,
  type TrendyolErrorPayload,
} from './core/errors/index.js';

// Resource classes, for typing your own dependency-injected wrappers.
export * from './resources/index.js';

// Request/response types for every endpoint.
export type * from './generated/index.js';
