import { TrendyolError } from '../errors/errors.js';

/** Values allowed in a path template. */
export type PathParams = Record<string, string | number | undefined>;

/**
 * Expand `{placeholders}` in an OpenAPI path template.
 *
 * Path templates are copied verbatim from the spec, so the only thing that
 * changes when Trendyol renames a segment is the string in the resource method.
 *
 * @throws {TrendyolError} when a placeholder has no value — a missing id must
 *   fail here rather than produce a request against `/orders/undefined`.
 */
export function expandPath(template: string, params: PathParams = {}, operationId = 'unknown'): string {
  return template.replace(/\{([^}]+)\}/g, (_match, name: string) => {
    const value = params[name];
    if (value === undefined || value === null || value === '') {
      throw new TrendyolError(`Missing path parameter "${name}" for ${operationId} (${template})`, {
        operationId,
        method: 'UNKNOWN',
        url: template,
      });
    }
    return encodeURIComponent(String(value));
  });
}

/** Join a base URL and a path without doubling or dropping the separator. */
export function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
