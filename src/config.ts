import type { Authenticator } from './core/auth/index.js';
import type { FetchLike, HttpClient, HttpHeaders } from './core/http/index.js';
import type { Logger } from './core/logger.js';
import type { Middleware } from './core/middleware/index.js';
import type { ArrayFormat } from './core/url/index.js';

/** Trendyol runs two gateways; test-order endpoints only exist on `stage`. */
export type TrendyolEnvironment = 'production' | 'stage';

/** Gateway roots. Every path in `openapi/*.json` is relative to these. */
export const BASE_URLS: Readonly<Record<TrendyolEnvironment, string>> = Object.freeze({
  production: 'https://apigw.trendyol.com/integration',
  stage: 'https://stageapigw.trendyol.com/integration',
});

interface CommonOptions {
  /** Seller (supplier) id from Seller Panel. Used in most paths and in the User-Agent. */
  sellerId: number | string;
  /** Defaults to `production`. */
  environment?: TrendyolEnvironment;
  /** Overrides {@link BASE_URLS} entirely — useful for a proxy or a mock server. */
  baseUrl?: string;
  /**
   * Integrator name used in the `User-Agent` header, which Trendyol requires on
   * every request as `"{sellerId} - {integrator}"`. Defaults to `SelfIntegration`.
   */
  integrator?: string;
  /** Full override of the User-Agent, when the default format is not wanted. */
  userAgent?: string;
  /** Per-request timeout in ms. `0` disables. Default 30000. Ignored if `httpClient` is given. */
  timeoutMs?: number;
  /** Custom fetch. Ignored if `httpClient` is given. */
  fetch?: FetchLike;
  /** Replaces the whole transport implementation (tests, instrumentation, proxies). */
  httpClient?: HttpClient;
  /** Extra pipeline steps: retries, metrics, caching. First entry is outermost. */
  middleware?: readonly Middleware[];
  /** Receives one debug line per request. Defaults to a silent logger. */
  logger?: Logger;
  /** Headers merged into every request; per-call headers still win. */
  defaultHeaders?: HttpHeaders;
  /** Array query encoding. Default `comma` (`?ids=1,2,3`), matching Trendyol's docs. */
  arrayFormat?: ArrayFormat;
}

/** Either API credentials, or a fully custom {@link Authenticator}. */
type CredentialOptions =
  | { apiKey: string; apiSecret: string; authenticator?: undefined }
  | { authenticator: Authenticator; apiKey?: undefined; apiSecret?: undefined };

/** Everything {@link TrendyolClient} accepts. */
export type ClientOptions = CommonOptions & CredentialOptions;

/** Normalised, validated configuration used internally. */
export interface ResolvedConfig {
  readonly sellerId: string;
  readonly baseUrl: string;
  readonly environment: TrendyolEnvironment;
  readonly userAgent: string;
  readonly defaultHeaders: HttpHeaders;
  readonly arrayFormat: ArrayFormat;
  readonly logger: Logger;
}

/** Validate user input once, at construction, so failures point at the config. */
export function resolveConfig(options: ClientOptions, logger: Logger): ResolvedConfig {
  const sellerId = String(options.sellerId ?? '').trim();
  if (!sellerId) throw new Error('TrendyolClient: `sellerId` is required.');

  if (!options.authenticator && (!options.apiKey || !options.apiSecret)) {
    throw new Error('TrendyolClient: `apiKey` and `apiSecret` are required unless a custom `authenticator` is given.');
  }

  const environment = options.environment ?? 'production';
  const baseUrl = (options.baseUrl ?? BASE_URLS[environment]).replace(/\/+$/, '');

  return {
    sellerId,
    baseUrl,
    environment,
    userAgent: options.userAgent ?? `${sellerId} - ${options.integrator ?? 'SelfIntegration'}`,
    defaultHeaders: options.defaultHeaders ?? {},
    arrayFormat: options.arrayFormat ?? 'comma',
    logger,
  };
}
