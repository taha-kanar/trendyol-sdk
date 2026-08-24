import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type { UpdatePriceAndInventoryBody, UpdatePriceAndInventoryResponse } from '../generated/product.js';

/**
 * Stock and price updates — the highest-traffic endpoint of the whole API.
 *
 * Separate from {@link ProductUpdatesResource} on purpose: it lives on a
 * different service (`/inventory`), takes effect within minutes rather than
 * going through content review, and is the only write most integrations run
 * on a schedule.
 *
 * @see https://developers.trendyol.com/v2.0/reference/inventory
 */
export class InventoryResource extends BaseResource {
  /**
   * Update price and/or stock for up to 1000 barcodes.
   *
   * Send only the fields you intend to change: omitting `quantity` leaves
   * stock untouched, omitting the price fields leaves pricing untouched.
   *
   * @operationId updatePriceAndInventory
   */
  update(
    body: UpdatePriceAndInventoryBody,
    options: RequestOptions = {}
  ): Promise<UpdatePriceAndInventoryResponse> {
    return this.transport.request<UpdatePriceAndInventoryResponse>({
      operationId: 'updatePriceAndInventory',
      method: 'POST',
      path: '/inventory/sellers/{sellerId}/products/price-and-inventory',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }
}
