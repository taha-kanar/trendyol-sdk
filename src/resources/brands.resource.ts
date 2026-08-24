import { toFormData } from '../core/http/form-data.js';
import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  CreateBrandBody,
  CreateBrandResponse,
  GetBrandsByNameQuery,
  GetBrandsByNameResponse,
  GetBrandsQuery,
  GetBrandsResponse,
} from '../generated/product.js';

/** {@link BrandsResource.create} needs a storefront, and it is mandatory. */
export interface CreateBrandOptions extends RequestOptions {
  /** Storefront the brand is created for, e.g. `TR`. Required by Trendyol. */
  storefrontCode: string;
}

/**
 * Brands: listing, searching, and requesting a new one.
 *
 * @see https://developers.trendyol.com/v2.0/reference/brands
 */
export class BrandsResource extends BaseResource {
  /**
   * Paginated list of every brand Trendyol knows.
   *
   * @operationId getBrands
   */
  list(query: GetBrandsQuery = {}, options: RequestOptions = {}): Promise<GetBrandsResponse> {
    return this.transport.request<GetBrandsResponse>({
      operationId: 'getBrands',
      method: 'GET',
      path: '/product/brands',
      query,
      ...this.options(options),
    });
  }

  /**
   * Search brands by name.
   *
   * @operationId getBrandsByName
   */
  searchByName(query: GetBrandsByNameQuery, options: RequestOptions = {}): Promise<GetBrandsByNameResponse> {
    return this.transport.request<GetBrandsByNameResponse>({
      operationId: 'getBrandsByName',
      method: 'GET',
      path: '/product/brands/by-name',
      query,
      ...this.options(options),
    });
  }

  /**
   * Request creation of a brand that does not exist yet.
   *
   * Sent as `multipart/form-data` with the brand's logo and documents; the
   * request goes to review rather than taking effect immediately.
   *
   * @operationId createBrand
   */
  create(body: CreateBrandBody, options: CreateBrandOptions): Promise<CreateBrandResponse> {
    return this.transport.request<CreateBrandResponse>({
      operationId: 'createBrand',
      method: 'POST',
      path: '/product/sellers/{sellerId}/brands',
      pathParams: { sellerId: this.sellerId },
      body: toFormData(body),
      ...this.options(options),
      headers: { ...options.headers, storefrontcode: options.storefrontCode },
    });
  }
}
