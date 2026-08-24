import type { RequestOptions } from '../core/resource/base-resource.js';

/**
 * Extra options accepted by the catalogue endpoints, which are storefront-aware.
 *
 * Trendyol spells the header `storefrontcode` on most endpoints but
 * `storeFrontCode` on brand creation. Both are lower-cased before they reach
 * the wire, so the difference is invisible here — but it is why this lives in
 * one place instead of being repeated per resource.
 */
export interface StorefrontOptions extends RequestOptions {
  /** Country code of the storefront. Omitted or `TR` means Türkiye. */
  storefrontCode?: string;
  /** Response language: `tr`, `en`, `ro`, `ar`, `el`. Ignored on the TR storefront. */
  acceptLanguage?: string;
}

/** Translate {@link StorefrontOptions} into the headers Trendyol expects. */
export function storefrontHeaders(options: StorefrontOptions = {}): Record<string, string> {
  const headers: Record<string, string> = { ...options.headers };
  if (options.storefrontCode) headers['storefrontcode'] = options.storefrontCode;
  if (options.acceptLanguage) headers['accept-language'] = options.acceptLanguage;
  return headers;
}
