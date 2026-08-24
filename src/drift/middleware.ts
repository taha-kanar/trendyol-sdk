import type { Middleware, Next } from '../core/middleware/types.js';
import type { HttpRequest, HttpResponse } from '../core/http/types.js';
import type { Logger } from '../core/logger.js';
import { findResponseSchema, findSchemaDrift, type DriftFinding, type SchemaDocument } from './compare.js';

/** Everything observed about one response that did not match its schema. */
export interface DriftReport {
  operationId: string;
  method: string;
  url: string;
  status: number;
  findings: DriftFinding[];
}

export interface DriftMiddlewareOptions {
  /** Documents to check against. Defaults to the specs shipped in `openapi/`. */
  documents: SchemaDocument[];
  /** Called once per response that drifted. Defaults to logging a warning. */
  onDrift?: (report: DriftReport) => void;
  logger?: Logger;
  /** Array elements inspected per node. Default 3. */
  sampleSize?: number;
  /** Maximum findings per response. Default 200. */
  limit?: number;
}

/**
 * Check every response against the committed schema and report what drifted.
 *
 * This is the answer to "the specs are behind — how do we learn about the
 * endpoints we cannot probe?". Probe scripts only reach read-only endpoints;
 * this reaches every endpoint an integration actually calls, writes included,
 * because it inspects the traffic instead of generating it.
 *
 * Findings carry field names and types only — never values — so it is safe to
 * leave on in staging. Keep it off in production: it parses every response body
 * a second time.
 *
 * ```ts
 * import { createDriftMiddleware, loadSpecDocuments } from 'trendyol-sdk/drift';
 *
 * const client = new TrendyolClient({
 *   // …
 *   middleware: [createDriftMiddleware({ documents: loadSpecDocuments(), logger: console })],
 * });
 * ```
 */
export function createDriftMiddleware(options: DriftMiddlewareOptions): Middleware {
  const { documents, logger, sampleSize, limit } = options;

  const report =
    options.onDrift ??
    ((drift: DriftReport): void => {
      logger?.warn(`schema drift in ${drift.operationId} (${drift.findings.length} finding(s))`, {
        status: drift.status,
        findings: drift.findings.map((finding) => `${finding.kind} ${finding.path}: ${finding.actual}`),
      });
    });

  return {
    name: 'drift-detection',
    async handle(request: HttpRequest, next: Next): Promise<HttpResponse> {
      const response = await next(request);
      const { operationId } = request.context;

      if (response.status < 200 || response.status >= 300 || !response.body) return response;

      let payload: unknown;
      try {
        payload = JSON.parse(response.body);
      } catch {
        return response; // not JSON; the transport will raise its own error
      }

      for (const document of documents) {
        const located = findResponseSchema(document, operationId);
        if (!located) continue;

        const findings = findSchemaDrift(document, located.schema, payload, '', {
          schemaPath: located.schemaPath,
          ...(sampleSize !== undefined ? { sampleSize } : {}),
          ...(limit !== undefined ? { limit } : {}),
        });
        if (findings.length) {
          report({ operationId, method: request.method, url: request.url, status: response.status, findings });
        }
        return response;
      }
      return response;
    },
  };
}
