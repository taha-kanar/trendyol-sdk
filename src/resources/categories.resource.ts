import { BaseResource } from '../core/resource/base-resource.js';
import { storefrontHeaders, type StorefrontOptions } from './storefront.js';
import type {
  GetCategoryAttributeValuesQuery,
  GetCategoryAttributeValuesResponse,
  GetCategoryAttributesQuery,
  GetCategoryAttributesResponse,
  GetCategoryTreeQuery,
  GetCategoryTreeResponse,
} from '../generated/product.js';

/**
 * The category tree and the attributes each category demands.
 *
 * Read this before creating products: `createProducts` rejects any payload
 * whose attributes do not match the target category's definition.
 *
 * @see https://developers.trendyol.com/v2.0/reference/categories
 */
export class CategoriesResource extends BaseResource {
  /**
   * Full category tree, optionally filtered by name.
   *
   * @operationId getCategoryTree
   */
  tree(query: GetCategoryTreeQuery = {}, options: StorefrontOptions = {}): Promise<GetCategoryTreeResponse> {
    return this.transport.request<GetCategoryTreeResponse>({
      operationId: 'getCategoryTree',
      method: 'GET',
      path: '/product/product-categories',
      query,
      ...this.options(options),
      headers: storefrontHeaders(options),
    });
  }

  /**
   * Attributes of a category, with `required` marking the mandatory ones.
   *
   * @operationId getCategoryAttributes
   */
  attributes(
    categoryId: number | string,
    query: GetCategoryAttributesQuery = {},
    options: StorefrontOptions = {}
  ): Promise<GetCategoryAttributesResponse> {
    return this.transport.request<GetCategoryAttributesResponse>({
      operationId: 'getCategoryAttributes',
      method: 'GET',
      path: '/product/categories/{categoryId}/attributes',
      pathParams: { categoryId },
      query,
      ...this.options(options),
      headers: storefrontHeaders(options),
    });
  }

  /**
   * Allowed values of a single attribute, paginated.
   *
   * @operationId getCategoryAttributeValues
   */
  attributeValues(
    categoryId: number | string,
    attributeId: number | string,
    query: GetCategoryAttributeValuesQuery = {},
    options: StorefrontOptions = {}
  ): Promise<GetCategoryAttributeValuesResponse> {
    return this.transport.request<GetCategoryAttributeValuesResponse>({
      operationId: 'getCategoryAttributeValues',
      method: 'GET',
      path: '/product/categories/{categoryId}/attributes/{attributeId}/values',
      pathParams: { categoryId, attributeId },
      query,
      ...this.options(options),
      headers: storefrontHeaders(options),
    });
  }
}
