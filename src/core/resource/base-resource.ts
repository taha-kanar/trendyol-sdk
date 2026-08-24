import type { OperationRequest, Transport } from '../transport.js';

/** Options every resource method accepts on top of its own parameters. */
export interface RequestOptions {
  /** Cancels the request. Works on every supported runtime. */
  signal?: AbortSignal;
  /** Extra headers for this call only. */
  headers?: Record<string, string>;
  /** Passed through to middleware via `request.context.meta`. */
  meta?: Record<string, unknown>;
}

/**
 * Shared base for the resource classes.
 *
 * A resource owns exactly one thing: mapping typed method arguments onto the
 * operation description its endpoints need. It depends on {@link Transport}
 * only, so any resource can be exercised with a stub transport in tests.
 */
export abstract class BaseResource {
  constructor(
    protected readonly transport: Transport,
    /** The configured seller id, injected so callers never repeat it. */
    protected readonly sellerId: string
  ) {}

  /**
   * Split shared {@link RequestOptions} out of a call into operation fields.
   *
   * Absent options are omitted rather than set to `undefined`, so spreading the
   * result never overwrites a value the caller already provided.
   */
  protected options(options: RequestOptions = {}): Partial<Pick<OperationRequest, 'signal' | 'headers' | 'meta'>> {
    const forwarded: Partial<Pick<OperationRequest, 'signal' | 'headers' | 'meta'>> = {};
    if (options.signal) forwarded.signal = options.signal;
    if (options.headers) forwarded.headers = options.headers;
    if (options.meta) forwarded.meta = options.meta;
    return forwarded;
  }
}
