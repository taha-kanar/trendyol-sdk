import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  ArchiveProductsBody,
  CreateProductsBody,
  CreateProductsResponse,
  DeleteProductsBody,
  DeleteProductsResponse,
  FilterApprovedProductsInventoryAndPriceQuery,
  FilterApprovedProductsInventoryAndPriceResponse,
  FilterApprovedProductsQuery,
  FilterApprovedProductsResponse,
  FilterUnapprovedProductsQuery,
  FilterUnapprovedProductsResponse,
  GetBuyboxInformationBody,
  GetBuyboxInformationResponse,
  GetProductBaseResponse,
  UnlockProductsBody,
  UnlockProductsResponse,
} from '../generated/product.js';

/**
 * The product catalogue: creating listings, filtering them, retiring them.
 *
 * Writes here are asynchronous. `createProducts` and friends return a
 * `batchRequestId`; poll {@link BatchRequestsResource.result} to learn whether
 * each item succeeded.
 *
 * @see https://developers.trendyol.com/v2.0/reference/products
 */
export class ProductsResource extends BaseResource {
  /**
   * Submit new products for listing.
   *
   * Up to 1000 items per call. Returns a batch id, not the created products.
   *
   * @operationId createProducts
   */
  create(body: CreateProductsBody, options: RequestOptions = {}): Promise<CreateProductsResponse> {
    return this.transport.request<CreateProductsResponse>({
      operationId: 'createProducts',
      method: 'POST',
      path: '/product/sellers/{sellerId}/v2/products',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Fetch one product's base information by barcode.
   *
   * @operationId getProductBase
   */
  getByBarcode(barcode: string, options: RequestOptions = {}): Promise<GetProductBaseResponse> {
    return this.transport.request<GetProductBaseResponse>({
      operationId: 'getProductBase',
      method: 'GET',
      path: '/product/sellers/{sellerId}/product/{barcode}',
      pathParams: { sellerId: this.sellerId, barcode },
      ...this.options(options),
    });
  }

  /**
   * List products still awaiting approval, with their rejection reasons.
   *
   * @operationId filterUnapprovedProducts
   */
  listUnapproved(
    query: FilterUnapprovedProductsQuery = {},
    options: RequestOptions = {}
  ): Promise<FilterUnapprovedProductsResponse> {
    return this.transport.request<FilterUnapprovedProductsResponse>({
      operationId: 'filterUnapprovedProducts',
      method: 'GET',
      path: '/product/sellers/{sellerId}/products/unapproved',
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }

  /**
   * List approved, live products.
   *
   * @operationId filterApprovedProducts
   */
  listApproved(
    query: FilterApprovedProductsQuery = {},
    options: RequestOptions = {}
  ): Promise<FilterApprovedProductsResponse> {
    return this.transport.request<FilterApprovedProductsResponse>({
      operationId: 'filterApprovedProducts',
      method: 'GET',
      path: '/product/sellers/{sellerId}/products/approved',
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }

  /**
   * Stock and price of approved products — the lightweight listing endpoint.
   *
   * Prefer this over {@link listApproved} when reconciling inventory: the
   * payload is far smaller and it accepts up to 50 barcodes at a time.
   *
   * @operationId filterApprovedProductsInventoryAndPrice
   */
  listApprovedInventoryAndPrice(
    query: FilterApprovedProductsInventoryAndPriceQuery = {},
    options: RequestOptions = {}
  ): Promise<FilterApprovedProductsInventoryAndPriceResponse> {
    return this.transport.request<FilterApprovedProductsInventoryAndPriceResponse>({
      operationId: 'filterApprovedProductsInventoryAndPrice',
      method: 'GET',
      path: '/product/sellers/{sellerId}/products/approved/inventory-and-price',
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }

  /**
   * Delete products that have never been sold.
   *
   * @operationId deleteProducts
   */
  delete(body: DeleteProductsBody, options: RequestOptions = {}): Promise<DeleteProductsResponse> {
    return this.transport.request<DeleteProductsResponse>({
      operationId: 'deleteProducts',
      method: 'DELETE',
      path: '/product/sellers/{sellerId}/products',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Archive or un-archive products, hiding them without deleting.
   *
   * @operationId archiveProducts
   */
  setArchiveState(body: ArchiveProductsBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'archiveProducts',
      method: 'PUT',
      path: '/product/sellers/{sellerId}/products/archive-state',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Buybox position and the winning price for given barcodes.
   *
   * @operationId getBuyboxInformation
   */
  buyboxInformation(
    body: GetBuyboxInformationBody,
    options: RequestOptions = {}
  ): Promise<GetBuyboxInformationResponse> {
    return this.transport.request<GetBuyboxInformationResponse>({
      operationId: 'getBuyboxInformation',
      method: 'POST',
      path: '/product/sellers/{sellerId}/products/buybox-information',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Unlock products locked by Trendyol's content controls.
   *
   * @operationId unlockProducts
   */
  unlock(body: UnlockProductsBody, options: RequestOptions = {}): Promise<UnlockProductsResponse> {
    return this.transport.request<UnlockProductsResponse>({
      operationId: 'unlockProducts',
      method: 'PUT',
      path: '/product/sellers/{sellerId}/products/unlock',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }
}
