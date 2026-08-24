import { BaseResource } from '../core/resource/base-resource.js';
import { storefrontHeaders, type StorefrontOptions } from './storefront.js';
import type { GetCargoProvidersResponse } from '../generated/product.js';

/**
 * Reference data shared across the catalogue and order APIs.
 *
 * @see https://developers.trendyol.com/v2.0/reference/lookup
 */
export class LookupResource extends BaseResource {
  /**
   * Cargo providers available to the seller, with the codes used when creating
   * products or changing a package's carrier.
   *
   * @operationId getCargoProviders
   */
  cargoProviders(options: StorefrontOptions = {}): Promise<GetCargoProvidersResponse> {
    return this.transport.request<GetCargoProvidersResponse>({
      operationId: 'getCargoProviders',
      method: 'GET',
      path: '/product/lookup/cargo-providers',
      ...this.options(options),
      headers: storefrontHeaders(options),
    });
  }
}
