import type { HttpRequest, HttpResponse } from '../http/types.js';
import type { Logger } from '../logger.js';
import type { Middleware, Next } from './types.js';

/** Logs one line per request with its status and duration. Off unless a logger is configured. */
export class LoggingMiddleware implements Middleware {
  readonly name = 'logging';

  constructor(
    private readonly logger: Logger,
    private readonly now: () => number = () => Date.now()
  ) {}

  async handle(request: HttpRequest, next: Next): Promise<HttpResponse> {
    const startedAt = this.now();
    this.logger.debug(`-> ${request.method} ${request.url}`, {
      operationId: request.context.operationId,
      attempt: request.context.attempt,
    });

    try {
      const response = await next(request);
      this.logger.debug(`<- ${response.status} ${request.method} ${request.url}`, {
        operationId: request.context.operationId,
        durationMs: this.now() - startedAt,
      });
      return response;
    } catch (error) {
      this.logger.error(`x- ${request.method} ${request.url}`, {
        operationId: request.context.operationId,
        durationMs: this.now() - startedAt,
        error,
      });
      throw error;
    }
  }
}
