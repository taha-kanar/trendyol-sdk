import type { HttpRequest, HttpResponse } from '../http/types.js';
import {
  TrendyolApiError,
  TrendyolAuthenticationError,
  TrendyolAuthorizationError,
  TrendyolBadRequestError,
  TrendyolConflictError,
  TrendyolNotFoundError,
  TrendyolRateLimitError,
  TrendyolServerError,
  type TrendyolErrorContext,
  type TrendyolErrorPayload,
} from './errors.js';

/** Status code -> error class. Unlisted statuses fall back by family. */
const BY_STATUS: Record<number, new (m: string, c: TrendyolErrorContext) => TrendyolApiError> = {
  400: TrendyolBadRequestError,
  401: TrendyolAuthenticationError,
  403: TrendyolAuthorizationError,
  404: TrendyolNotFoundError,
  409: TrendyolConflictError,
};

function parsePayload(body: string): TrendyolErrorPayload | undefined {
  if (!body) return undefined;
  try {
    const parsed: unknown = JSON.parse(body);
    return typeof parsed === 'object' && parsed !== null ? (parsed as TrendyolErrorPayload) : undefined;
  } catch {
    return undefined;
  }
}

/** Best-effort human-readable message, in decreasing order of specificity. */
function describe(status: number, statusText: string, payload?: TrendyolErrorPayload): string {
  const fromList = Array.isArray(payload?.errors)
    ? payload.errors.map((e) => e?.message ?? e?.errorCode).filter(Boolean).join('; ')
    : '';
  const detail = fromList || payload?.message || payload?.error || statusText || 'Unknown error';
  return `Trendyol API responded ${status}: ${detail}`;
}

function parseRetryAfter(headers: Record<string, string>): number | undefined {
  const raw = headers['retry-after'];
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return seconds * 1000;
  const date = Date.parse(raw);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

/**
 * Turn a non-2xx response into the most specific error class available.
 *
 * Adding a new status mapping means adding a line to {@link BY_STATUS} — no
 * call site changes, which is what keeps this open for extension.
 */
export function createApiError(request: HttpRequest, response: HttpResponse): TrendyolApiError {
  const payload = parsePayload(response.body);
  const context: TrendyolErrorContext = {
    operationId: request.context.operationId,
    method: request.method,
    url: request.url,
    status: response.status,
    requestId: response.headers['x-request-id'] ?? response.headers['x-correlation-id'],
    payload,
    body: response.body ? response.body.slice(0, 2000) : undefined,
  };
  const message = describe(response.status, response.statusText, payload);

  if (response.status === 429) {
    return new TrendyolRateLimitError(message, context, parseRetryAfter(response.headers));
  }
  const Specific = BY_STATUS[response.status];
  if (Specific) return new Specific(message, context);
  if (response.status >= 500) return new TrendyolServerError(message, context);
  return new TrendyolApiError(message, context);
}
