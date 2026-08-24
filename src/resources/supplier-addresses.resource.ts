import { BaseResource } from '../core/resource/base-resource.js';
import { storefrontHeaders, type StorefrontOptions } from './storefront.js';
import type { GetSuppliersAddressesResponse } from '../generated/supplier-address.js';

/**
 * The seller's own addresses: warehouses, invoice and return addresses.
 *
 * `warehouseId` values used when creating products or updating a package's
 * warehouse come from here.
 *
 * @see https://developers.trendyol.com/v2.0/reference/supplier-information-integration
 */
export class SupplierAddressesResource extends BaseResource {
  /**
   * All addresses registered for the seller.
   *
   * @operationId getSuppliersAddresses
   */
  list(options: StorefrontOptions = {}): Promise<GetSuppliersAddressesResponse> {
    return this.transport.request<GetSuppliersAddressesResponse>({
      operationId: 'getSuppliersAddresses',
      method: 'GET',
      path: '/sellers/{sellerId}/addresses',
      pathParams: { sellerId: this.sellerId },
      ...this.options(options),
      headers: storefrontHeaders(options),
    });
  }
}
