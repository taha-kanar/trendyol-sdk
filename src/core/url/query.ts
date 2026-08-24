/** Values a query parameter may hold before serialisation. */
export type QueryValue = string | number | boolean | Date | null | undefined | ReadonlyArray<string | number | boolean>;
export type QueryParams = Record<string, QueryValue>;

/**
 * How array-valued query parameters are encoded.
 *
 * - `comma` — `?ids=1,2,3` (Trendyol's documented behaviour, the default)
 * - `repeat` — `?ids=1&ids=2&ids=3` (the OpenAPI default, kept as an escape hatch)
 */
export type ArrayFormat = 'comma' | 'repeat';

function encodeScalar(value: string | number | boolean | Date): string {
  return value instanceof Date ? String(value.getTime()) : String(value);
}

/**
 * Serialise query parameters, dropping `undefined` and `null` entries.
 *
 * Dropping empties matters: Trendyol rejects `?status=` on several endpoints,
 * so optional filters must disappear entirely rather than be sent blank.
 */
export function serializeQuery(params: QueryParams = {}, arrayFormat: ArrayFormat = 'comma'): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (arrayFormat === 'comma') {
        search.append(key, value.map(encodeScalar).join(','));
      } else {
        for (const item of value) search.append(key, encodeScalar(item));
      }
      continue;
    }

    search.append(key, encodeScalar(value as string | number | boolean | Date));
  }

  return search.toString();
}
