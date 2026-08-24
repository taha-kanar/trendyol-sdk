import type { HttpRequest, HttpResponse } from '../http/types.js';
import type { Middleware, Next } from './types.js';

/**
 * Fold a middleware list into a single callable, `terminal` innermost.
 *
 * Each middleware is invoked at most once per pipeline run; calling `next`
 * twice (as a naive retry middleware might) re-enters only the inner half of
 * the chain, which is the intended semantics.
 */
export function composeMiddleware(middleware: readonly Middleware[], terminal: Next): Next {
  return middleware.reduceRight<Next>(
    (next, current) => (request: HttpRequest): Promise<HttpResponse> => current.handle(request, next),
    terminal
  );
}
