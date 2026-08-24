import type { HttpRequest, HttpResponse } from '../http/types.js';

/** Hands the request to the next middleware, ending at the {@link HttpClient}. */
export type Next = (request: HttpRequest) => Promise<HttpResponse>;

/**
 * A step in the request pipeline.
 *
 * Middleware is the extension point of this SDK: retries, logging, metrics,
 * caching and rate limiting are all "add a middleware", never "edit the
 * transport". Order is the order given in {@link ClientOptions.middleware};
 * the first entry is outermost and sees the final response last.
 */
export interface Middleware {
  /** Shown in debug logs and errors. Keep it short, e.g. `retry`. */
  readonly name: string;
  handle(request: HttpRequest, next: Next): Promise<HttpResponse>;
}
