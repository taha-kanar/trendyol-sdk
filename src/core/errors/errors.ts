/** Shape Trendyol uses for error payloads. Fields vary per service, all optional. */
export interface TrendyolErrorPayload {
  errors?: Array<{ key?: string; message?: string; errorCode?: string }>;
  error?: string;
  message?: string;
  code?: string;
  [key: string]: unknown;
}

/** Details attached to every API error, useful for logging and support tickets. */
export interface TrendyolErrorContext {
  readonly operationId: string;
  readonly method: string;
  readonly url: string;
  readonly status?: number;
  readonly requestId?: string | undefined;
  readonly payload?: TrendyolErrorPayload | undefined;
  readonly body?: string | undefined;
}

/** Base class for everything this SDK throws. `catch (e) { if (e instanceof TrendyolError) ... }` */
export class TrendyolError extends Error {
  override readonly name: string = 'TrendyolError';

  constructor(
    message: string,
    readonly context: TrendyolErrorContext,
    options?: { cause?: unknown }
  ) {
    super(message, options as ErrorOptions);
    // Restores `instanceof` when the package is compiled down to ES5 targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** The request never produced an HTTP response (DNS, TLS, socket, offline). */
export class TrendyolConnectionError extends TrendyolError {
  override readonly name = 'TrendyolConnectionError';
}

/** The request exceeded the configured timeout, or its signal was aborted. */
export class TrendyolTimeoutError extends TrendyolError {
  override readonly name = 'TrendyolTimeoutError';
}

/** A 2xx response arrived but its body was not the JSON the endpoint promises. */
export class TrendyolParseError extends TrendyolError {
  override readonly name = 'TrendyolParseError';
}

/** Any non-2xx HTTP response. Subclassed per status family below. */
export class TrendyolApiError extends TrendyolError {
  override readonly name: string = 'TrendyolApiError';

  /** HTTP status code. Always present on this class and its subclasses. */
  get status(): number {
    return this.context.status ?? 0;
  }

  /** Flattened `errors[].message` list, falling back to `message` / `error`. */
  get details(): string[] {
    const payload = this.context.payload;
    if (!payload) return [];
    if (Array.isArray(payload.errors)) {
      return payload.errors.map((e) => e?.message ?? e?.errorCode ?? '').filter(Boolean);
    }
    const single = payload.message ?? payload.error;
    return single ? [single] : [];
  }
}

/** 400 — malformed request, failed validation. */
export class TrendyolBadRequestError extends TrendyolApiError {
  override readonly name = 'TrendyolBadRequestError';
}

/** 401 — missing or wrong API key / secret. */
export class TrendyolAuthenticationError extends TrendyolApiError {
  override readonly name = 'TrendyolAuthenticationError';
}

/** 403 — credentials are valid but the seller lacks access to the resource. */
export class TrendyolAuthorizationError extends TrendyolApiError {
  override readonly name = 'TrendyolAuthorizationError';
}

/** 404 — no such package, product, claim… */
export class TrendyolNotFoundError extends TrendyolApiError {
  override readonly name = 'TrendyolNotFoundError';
}

/** 409 — conflicting state, e.g. a package already moved past that status. */
export class TrendyolConflictError extends TrendyolApiError {
  override readonly name = 'TrendyolConflictError';
}

/** 429 — quota exceeded. Check {@link retryAfterMs} before retrying. */
export class TrendyolRateLimitError extends TrendyolApiError {
  override readonly name = 'TrendyolRateLimitError';

  constructor(
    message: string,
    context: TrendyolErrorContext,
    /** Value of the `Retry-After` header in milliseconds, when the API sent one. */
    readonly retryAfterMs?: number,
    options?: { cause?: unknown }
  ) {
    super(message, context, options);
  }
}

/** 5xx — the fault is on Trendyol's side. Safe to retry idempotent calls. */
export class TrendyolServerError extends TrendyolApiError {
  override readonly name = 'TrendyolServerError';
}
