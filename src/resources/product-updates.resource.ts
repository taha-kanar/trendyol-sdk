import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import { storefrontHeaders, type StorefrontOptions } from './storefront.js';
import type {
  GetUpdateAuditsQuery,
  GetUpdateAuditsResponse,
  UpdateContentBulkBody,
  UpdateContentBulkResponse,
  UpdateDeliveryInfoBulkBody,
  UpdateDeliveryInfoBulkResponse,
  UpdateUnapprovedProductsBody,
  UpdateUnapprovedProductsResponse,
  UpdateVariantBulkBody,
  UpdateVariantBulkResponse,
} from '../generated/product.js';

/**
 * Bulk edits to existing listings.
 *
 * Which endpoint applies depends on what changes and on the product's approval
 * state — approved products cannot be edited through the unapproved endpoint,
 * and content, variant and delivery fields are three separate pipelines.
 * Every call returns a `batchRequestId`.
 *
 * @see https://developers.trendyol.com/v2.0/reference/updates
 */
export class ProductUpdatesResource extends BaseResource {
  /**
   * Update products that have not been approved yet.
   *
   * @operationId updateUnapprovedProducts
   */
  unapproved(
    body: UpdateUnapprovedProductsBody,
    options: RequestOptions = {}
  ): Promise<UpdateUnapprovedProductsResponse> {
    return this.transport.request<UpdateUnapprovedProductsResponse>({
      operationId: 'updateUnapprovedProducts',
      method: 'POST',
      path: '/product/sellers/{sellerId}/products/unapproved-bulk-update',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Update descriptive content (title, description, images, attributes).
   *
   * @operationId updateContentBulk
   */
  content(body: UpdateContentBulkBody, options: RequestOptions = {}): Promise<UpdateContentBulkResponse> {
    return this.transport.request<UpdateContentBulkResponse>({
      operationId: 'updateContentBulk',
      method: 'POST',
      path: '/product/sellers/{sellerId}/products/content-bulk-update',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Update variant fields (barcode-level data) of approved products.
   *
   * @operationId updateVariantBulk
   */
  variants(body: UpdateVariantBulkBody, options: RequestOptions = {}): Promise<UpdateVariantBulkResponse> {
    return this.transport.request<UpdateVariantBulkResponse>({
      operationId: 'updateVariantBulk',
      method: 'POST',
      path: '/product/sellers/{sellerId}/products/variant-bulk-update',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Update shipping and delivery configuration of approved products.
   *
   * @operationId updateDeliveryInfoBulk
   */
  deliveryInfo(
    body: UpdateDeliveryInfoBulkBody,
    options: RequestOptions = {}
  ): Promise<UpdateDeliveryInfoBulkResponse> {
    return this.transport.request<UpdateDeliveryInfoBulkResponse>({
      operationId: 'updateDeliveryInfoBulk',
      method: 'POST',
      path: '/product/sellers/{sellerId}/products/delivery-info-bulk-update',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * History of update attempts on one product, with rejection reasons.
   *
   * @operationId getUpdateAudits
   */
  audits(
    contentId: number | string,
    query: GetUpdateAuditsQuery = {},
    options: StorefrontOptions = {}
  ): Promise<GetUpdateAuditsResponse> {
    return this.transport.request<GetUpdateAuditsResponse>({
      operationId: 'getUpdateAudits',
      method: 'GET',
      path: '/product/sellers/{sellerId}/products/{contentId}/update-audits',
      pathParams: { sellerId: this.sellerId, contentId },
      query,
      ...this.options(options),
      headers: storefrontHeaders(options),
    });
  }
}
