/* eslint-disable */
/**
 * Trendyol International Marketplace - Product Integration API
 * Trendyol International Marketplace product integration API services for non-TR sellers. Covers product creation (V2), filtering, updating, deletion, archiving, stock-price updating, buybox, unlock, and batch request tracking services. 
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/product.json · regenerate with `npm run generate`.
 */

import type { FileInput } from '../core/http/form-data.js';

export interface Brand {
  id?: number;
  name?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  luxe?: boolean;
}

export interface BrandsResponse {
  brands?: Brand[];
}

export interface Category {
  id?: number;
  name?: string;
  parentId?: number;
  subCategories?: Category[];
}

export interface CategoryAttribute {
  allowCustom?: boolean;
  attribute?: {
    id?: number;
    name?: string;
  };
  categoryId?: number;
  required?: boolean;
  varianter?: boolean;
  slicer?: boolean;
  allowMultipleAttributeValues?: boolean;
}

export interface CategoryAttributesResponse {
  id?: number;
  name?: string;
  displayName?: string;
  categoryAttributes?: CategoryAttribute[];
}

export interface AttributeValueItem {
  attributeValueId?: number;
  attributeValueName?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  attributeValue?: string;
}

export interface AttributeValuesPageResponse {
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  content?: AttributeValueItem[];
}

export interface ProductImage {
  url: string;
}

export interface ProductAttribute {
  attributeId: number;
  attributeValueIds?: number[];
  attributeValue?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  attributeName?: string;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  attributeValueId?: number;
}

export interface DeliveryOption {
  deliveryDuration?: number;
  fastDeliveryType?: "SAME_DAY_SHIPPING" | "FAST_DELIVERY";
}

export interface CreateProductItem {
  barcode: string;
  title: string;
  productMainId: string;
  brandId: number;
  categoryId: number;
  quantity: number;
  stockCode: string;
  dimensionalWeight: number;
  description: string;
  listPrice: number;
  salePrice: number;
  deliveryOption?: DeliveryOption;
  images: ProductImage[];
  vatRate: number;
  lotNumber?: string | null;
  shipmentAddressId?: number;
  returningAddressId?: number;
  attributes: ProductAttribute[];
}

export interface CreateProductsRequest {
  items: CreateProductItem[];
}

export interface DeleteProductItem {
  barcode: string;
}

export interface DeleteProductsRequest {
  items: DeleteProductItem[];
}

export interface ArchiveProductItem {
  barcode: string;
  archived: boolean;
}

export interface ArchiveProductsRequest {
  items: ArchiveProductItem[];
}

export interface UnlockProductItem {
  barcode: string;
}

export interface UnlockProductsRequest {
  items: UnlockProductItem[];
}

export interface BuyboxRequest {
  barcodes: string[];
}

export interface BuyboxInfo {
  barcode?: string;
  buyboxOrder?: number;
  buyboxPrice?: number;
  hasMultipleSeller?: boolean;
}

export interface BuyboxResponse {
  buyboxInfo?: BuyboxInfo[];
}

export interface PriceAndInventoryItem {
  barcode: string;
  quantity?: number;
  salePrice?: number;
  listPrice?: number;
}

export interface PriceAndInventoryRequest {
  items: PriceAndInventoryItem[];
}

export interface ProductBaseResponse {
  barcode?: string;
  approved?: boolean;
  /** @format int64 */
  approvedDate?: number;
  archived?: boolean;
  listingId?: string;
  contentId?: number;
}

export interface BrandInfo {
  id?: number;
  name?: string;
}

export interface CategoryInfo {
  id?: number;
  name?: string;
}

export interface RejectReasonDetail {
  rejectReason?: string;
  rejectReasonDetail?: string;
}

export interface UnapprovedProduct {
  supplierId?: number;
  productMainId?: string;
  /** @format int64 */
  createDateTime?: number;
  /** @format int64 */
  lastUpdateDate?: number;
  /** @format int64 */
  lastPriceChangeDate?: number;
  /** @format int64 */
  lastStockChangeDate?: number;
  brand?: BrandInfo;
  category?: CategoryInfo;
  barcode?: string;
  title?: string;
  description?: string;
  quantity?: number;
  listPrice?: number;
  salePrice?: number;
  vatRate?: number;
  dimensionalWeight?: number | null;
  stockCode?: string;
  media?: ProductImage[];
  attributes?: ProductAttribute[];
  rejectReasonDetails?: RejectReasonDetail[];
  locationBasedDelivery?: "ENABLED" | "DISABLED" | null;
  lotNumber?: string | null;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  status?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  origin?: unknown;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  images?: {
    url?: string;
  }[];
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  specialConsumptionTax?: unknown;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  sgrPrice?: unknown;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  cargoProviders?: unknown[];
}

export interface UnapprovedProductsResponse {
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  nextPageToken?: string;
  content?: UnapprovedProduct[];
}

export interface ApprovedAttributeValue {
  attributeValueId?: number | null;
  attributeValue?: string;
}

export interface ApprovedAttribute {
  attributeId?: number;
  attributeName?: string;
  attributeValues?: ApprovedAttributeValue[];
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  attributeValue?: string;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  attributeValueId?: number;
}

export interface VariantAttribute {
  attributeId?: number;
  attributeName?: string;
  attributeValueId?: number;
  attributeValue?: string;
}

export interface FastDeliveryOption {
  deliveryOptionType?: "SAME_DAY_SHIPPING" | "FAST_DELIVERY";
  deliveryDailyCutOffHour?: string;
}

export interface VariantDeliveryOptions {
  deliveryDuration?: number;
  isRushDelivery?: boolean;
  fastDeliveryOptions?: FastDeliveryOption[];
}

export interface VariantPrice {
  salePrice?: number;
  listPrice?: number;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  priceSeenByCustomer?: number;
}

export interface VariantStock {
  /** @format int64 */
  lastModifiedDate?: number | null;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  quantity?: number;
}

export interface ApprovedVariant {
  variantId?: number;
  supplierId?: number;
  barcode?: string;
  attributes?: VariantAttribute[];
  productUrl?: string;
  onSale?: boolean;
  deliveryOptions?: VariantDeliveryOptions;
  stock?: VariantStock;
  price?: VariantPrice;
  stockCode?: string;
  vatRate?: number;
  /** @format int64 */
  sellerCreatedDate?: number;
  /** @format int64 */
  sellerModifiedDate?: number;
  locked?: boolean;
  lockReason?: string | null;
  /** @format int64 */
  lockDate?: number | null;
  archived?: boolean;
  /** @format int64 */
  archivedDate?: number | null;
  docNeeded?: boolean;
  hasViolation?: boolean;
  blacklisted?: boolean;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  commission?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  dimensionalWeight?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  locationBasedDelivery?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  channels?: string[];
}

export interface ApprovedContent {
  contentId?: number;
  productMainId?: string;
  brand?: BrandInfo;
  category?: CategoryInfo;
  /** @format int64 */
  creationDate?: number;
  /** @format int64 */
  lastModifiedDate?: number;
  lastModifiedBy?: string;
  title?: string;
  description?: string;
  images?: ProductImage[];
  attributes?: ApprovedAttribute[];
  variants?: ApprovedVariant[];
}

export interface ApprovedProductsResponse {
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  nextPageToken?: string;
  content?: ApprovedContent[];
}

export interface UpdateUnapprovedItem {
  barcode: string;
  title?: string;
  description?: string;
  productMainId?: string;
  brandId?: number;
  categoryId?: number;
  stockCode?: string;
  dimensionalWeight?: number;
  vatRate?: number;
  deliveryOption?: DeliveryOption;
  locationBasedDelivery?: "ENABLED" | "DISABLED" | null;
  lotNumber?: string | null;
  shipmentAddressId?: number;
  returningAddressId?: number;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}

export interface UpdateUnapprovedRequest {
  items: UpdateUnapprovedItem[];
}

export interface ContentUpdateItem {
  contentId: number;
  title?: string;
  description?: string;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}

export interface ContentBulkUpdateRequest {
  items: ContentUpdateItem[];
}

export interface VariantUpdateItem {
  barcode: string;
  stockCode?: string;
  vatRate?: number;
  shipmentAddressId?: number;
  returningAddressId?: number;
  dimensionalWeight?: number;
  lotNumber?: string | null;
  locationBasedDelivery?: "ENABLED" | "DISABLED" | null;
}

export interface VariantBulkUpdateRequest {
  items: VariantUpdateItem[];
}

export interface DeliveryInfoUpdateItem {
  barcode: string;
  deliveryOptions?: {
    deliveryDuration?: number;
    fastDeliveryType?: "SAME_DAY_SHIPPING" | "FAST_DELIVERY";
  };
}

export interface DeliveryInfoBulkUpdateRequest {
  items: DeliveryInfoUpdateItem[];
}

export interface BatchRequestResponse {
  batchRequestId?: string;
}

export interface BatchRequestResult {
  batchRequestId?: string;
  items?: {
    requestItem?: Record<string, unknown>;
    status?: "SUCCESS" | "FAILED";
    failureReasons?: string[];
  }[];
  status?: "COMPLETED" | "IN_PROGRESS";
  /** @format int64 */
  creationDate?: number;
  /** @format int64 */
  lastModification?: number;
  sourceType?: "API" | "WEB";
  itemCount?: number;
  failedItemCount?: number;
  batchRequestType?: "ProductV2OnBoarding" | "ProductV2Update" | "ProductInventoryUpdate" | "ProductArchiveUpdate" | "ProductDeletion";
}

export interface ErrorResponse {
  errors?: {
    key?: string;
    message?: string;
    errorCode?: string;
  }[];
}

export interface CreateBrandRequest {
  /** Name of the brand to be created */
  name: string;
  /** Images belonging to the brand */
  images: FileInput[];
}

export interface CreateBrandResponse {
  /** @format int64 */
  brandId?: number;
}

export interface InventoryAndPriceVariant {
  /** @format int64 */
  variantId?: number;
  barcode?: string;
  salePrice?: number;
  listPrice?: number;
  quantity?: number;
  stockCode?: string;
  /**
   * Returns null if no stock update has been made for the product
   * @format int64
   */
  stockLastModifiedDate?: number | null;
}

export interface InventoryAndPriceContent {
  /** @format int64 */
  contentId?: number;
  productMainId?: string;
  variants?: InventoryAndPriceVariant[];
}

export interface InventoryAndPriceResponse {
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  nextPageToken?: string;
  content?: InventoryAndPriceContent[];
}

export interface UpdateAuditRejectReason {
  /** Reject reason type */
  type?: string;
  /** Reject reason summary */
  reason?: string;
  /** Reject reason detail */
  detail?: string;
  /** Additional reject reason parameters */
  parameters?: Record<string, unknown>;
}

export interface UpdateAuditImage {
  url?: string;
  order?: number;
}

export interface UpdateAuditAttribute {
  attributeId?: number;
  attributeValueId?: number;
  customAttributeValue?: string;
  attributeValue?: string;
}

/** Update detail. The populated fields vary depending on the value of the type field: changedTitle/existingTitle for TITLE, changedDescription/existingDescription for DESCRIPTION, changedMedias/existingMedias for MEDIA, and changedAttributes/existingAttributes for ATTRIBUTE. */
export interface UpdateAuditDetail {
  type?: "TITLE" | "DESCRIPTION" | "MEDIA" | "ATTRIBUTE";
  status?: "SUCCESS" | "FAIL" | "RUNNING";
  completedDate?: string;
  /** Returned when status is FAIL */
  rejectReasons?: UpdateAuditRejectReason[];
  changedTitle?: string;
  existingTitle?: string;
  changedDescription?: string;
  existingDescription?: string;
  changedMedias?: UpdateAuditImage[];
  existingMedias?: UpdateAuditImage[];
  changedAttributes?: UpdateAuditAttribute[];
  existingAttributes?: UpdateAuditAttribute[];
}

export interface UpdateAuditItem {
  barcode?: string;
  /** @format int64 */
  contentId?: number;
  batchRequestId?: string;
  requestDate?: string;
  updates?: UpdateAuditDetail[];
}

export interface UpdateAuditsResponse {
  page?: number;
  size?: number;
  totalPage?: number;
  content?: UpdateAuditItem[];
}

export interface CargoProvider {
  /** Cargo provider code. This value is sent in the cargoProviders field. */
  code?: string;
  /** Display name of the cargo provider */
  name?: string;
}

/** Query parameters for `GET /product/brands`. */
export type GetBrandsQuery = {
  /** Page number indicating which page of brands to retrieve */
  page?: number;
  /** Number of brands to include in a single response */
  size?: number;
};

/** Response of `GET /product/brands`. */
export type GetBrandsResponse = BrandsResponse;

/** Query parameters for `GET /product/brands/by-name`. */
export type GetBrandsByNameQuery = {
  /** Brand name to search for (case-sensitive) */
  name: string;
};

/** Response of `GET /product/brands/by-name`. */
export type GetBrandsByNameResponse = Brand[];

/** Optional headers accepted by `POST /product/sellers/{sellerId}/brands`. */
export type CreateBrandHeaders = {
  /** Country code the brand will be created for (TR for Türkiye) */
  storeFrontCode: string;
};

/** Request body for `POST /product/sellers/{sellerId}/brands`. */
export type CreateBrandBody = CreateBrandRequest;

/** Query parameters for `GET /product/product-categories`. */
export type GetCategoryTreeQuery = {
  /** Category name filter. Returns categories at every level whose name contains the given keyword. */
  name?: string;
};

/** Optional headers accepted by `GET /product/product-categories`. */
export type GetCategoryTreeHeaders = {
  /** Country code. If not sent, or if TR is sent, the Türkiye storefront is used. */
  storefrontcode?: string;
  /** Language of the service response. On the TR storefront the response is always returned in Turkish. On other storefronts the values tr, en, ro, ar, and el are supported; en is used when the header is omitted or an unsupported value is sent. */
  "Accept-Language"?: string;
};

/** Response of `GET /product/product-categories`. */
export type GetCategoryTreeResponse = Category[];

/** Query parameters for `GET /product/categories/{categoryId}/attributes`. */
export type GetCategoryAttributesQuery = {
  /** When true, only required attributes are returned; when false, only non-required attributes are returned. If omitted, all attributes are returned. */
  required?: boolean;
};

/** Optional headers accepted by `GET /product/categories/{categoryId}/attributes`. */
export type GetCategoryAttributesHeaders = {
  /** Country code. If not sent, or if TR is sent, the Türkiye storefront is used. */
  storefrontcode?: string;
  /** Language of the service response. On the TR storefront the response is always returned in Turkish. On other storefronts the values tr, en, ro, ar, and el are supported; en is used when the header is omitted or an unsupported value is sent. */
  "Accept-Language"?: string;
};

/** Response of `GET /product/categories/{categoryId}/attributes`. */
export type GetCategoryAttributesResponse = CategoryAttributesResponse;

/** Query parameters for `GET /product/categories/{categoryId}/attributes/{attributeId}/values`. */
export type GetCategoryAttributeValuesQuery = {
  /**
   * Page number (max 1000)
   * @maximum 1000
   */
  page?: number;
  /**
   * Maximum number of items per page (max 1000)
   * @maximum 1000
   */
  size?: number;
};

/** Optional headers accepted by `GET /product/categories/{categoryId}/attributes/{attributeId}/values`. */
export type GetCategoryAttributeValuesHeaders = {
  /** Country code. If not sent, or if TR is sent, the Türkiye storefront is used. */
  storefrontcode?: string;
  /** Language of the service response. On the TR storefront the response is always returned in Turkish. On other storefronts the values tr, en, ro, ar, and el are supported; en is used when the header is omitted or an unsupported value is sent. */
  "Accept-Language"?: string;
};

/** Response of `GET /product/categories/{categoryId}/attributes/{attributeId}/values`. */
export type GetCategoryAttributeValuesResponse = AttributeValuesPageResponse;

/** Request body for `POST /product/sellers/{sellerId}/v2/products`. */
export type CreateProductsBody = CreateProductsRequest;

/** Response of `POST /product/sellers/{sellerId}/v2/products`. */
export type CreateProductsResponse = BatchRequestResponse;

/** Response of `GET /product/sellers/{sellerId}/product/{barcode}`. */
export type GetProductBaseResponse = ProductBaseResponse;

/** Query parameters for `GET /product/sellers/{sellerId}/products/unapproved`. */
export type FilterUnapprovedProductsQuery = {
  /** Single barcode query */
  barcode?: string;
  /**
   * Start date (timestamp)
   * @format int64
   */
  startDate?: number;
  /**
   * End date (timestamp)
   * @format int64
   */
  endDate?: number;
  /** Page number */
  page?: number;
  /** Date filter type */
  dateQueryType?: "CREATED_DATE" | "LAST_MODIFIED_DATE";
  /**
   * Items per page (max 1000)
   * @maximum 1000
   */
  size?: number;
  /**
   * Supplier ID
   * @format int64
   */
  supplierId?: number;
  /** Stock code */
  stockCode?: string;
  /** Main product code */
  productMainId?: string;
  /** List of brand IDs */
  brandIds?: number[];
  /** Product approval status */
  status?: "rejected" | "pendingApproval";
  /** Next page token when there are more than 10,000 products */
  nextPageToken?: string;
};

/** Response of `GET /product/sellers/{sellerId}/products/unapproved`. */
export type FilterUnapprovedProductsResponse = UnapprovedProductsResponse;

/** Query parameters for `GET /product/sellers/{sellerId}/products/approved`. */
export type FilterApprovedProductsQuery = {
  /** Single barcode query */
  barcode?: string;
  /**
   * Start date (timestamp)
   * @format int64
   */
  startDate?: number;
  /**
   * End date (timestamp)
   * @format int64
   */
  endDate?: number;
  /** Page number */
  page?: number;
  /** Date filter type */
  dateQueryType?: "VARIANT_CREATED_DATE" | "VARIANT_MODIFIED_DATE" | "CONTENT_MODIFIED_DATE";
  /**
   * Items per page (max 100)
   * @maximum 100
   */
  size?: number;
  /**
   * Supplier ID
   * @format int64
   */
  supplierId?: number;
  /** Stock code */
  stockCode?: string;
  /** Main product code */
  productMainId?: string;
  /** List of brand IDs */
  brandIds?: number[];
  /** Product status filter */
  status?: "archived" | "blacklisted" | "locked" | "onSale";
  /** Next page token when there are more than 10,000 content items */
  nextPageToken?: string;
};

/** Response of `GET /product/sellers/{sellerId}/products/approved`. */
export type FilterApprovedProductsResponse = ApprovedProductsResponse;

/** Query parameters for `GET /product/sellers/{sellerId}/products/approved/inventory-and-price`. */
export type FilterApprovedProductsInventoryAndPriceQuery = {
  /** Single barcode query */
  barcode?: string;
  /** Multiple barcode query (max 50 barcodes) */
  barcodes?: string[];
  /**
   * Single content ID query
   * @format int64
   */
  contentId?: number;
  /** Stock code */
  stockCode?: string;
  /** Main product code */
  productMainId?: string;
  /** Product status filter */
  status?: "archived" | "blacklisted" | "locked" | "onSale" | "notOnSale";
  /** Page number */
  page?: number;
  /**
   * Items per page (max 100)
   * @maximum 100
   */
  size?: number;
  /** Sort direction based on the sellerCreatedDate field. asc sorts from oldest to newest, desc sorts from newest to oldest. */
  orderByDirection?: "asc" | "desc";
  /** Next page token when there are more than 10,000 content items */
  nextPageToken?: string;
};

/** Response of `GET /product/sellers/{sellerId}/products/approved/inventory-and-price`. */
export type FilterApprovedProductsInventoryAndPriceResponse = InventoryAndPriceResponse;

/** Request body for `DELETE /product/sellers/{sellerId}/products`. */
export type DeleteProductsBody = DeleteProductsRequest;

/** Response of `DELETE /product/sellers/{sellerId}/products`. */
export type DeleteProductsResponse = BatchRequestResponse;

/** Request body for `PUT /product/sellers/{sellerId}/products/archive-state`. */
export type ArchiveProductsBody = ArchiveProductsRequest;

/** Response of `PUT /product/sellers/{sellerId}/products/archive-state`. */
export type ArchiveProductsResponse = BatchRequestResponse;

/** Request body for `POST /product/sellers/{sellerId}/products/buybox-information`. */
export type GetBuyboxInformationBody = BuyboxRequest;

/** Response of `POST /product/sellers/{sellerId}/products/buybox-information`. */
export type GetBuyboxInformationResponse = BuyboxResponse;

/** Request body for `PUT /product/sellers/{sellerId}/products/unlock`. */
export type UnlockProductsBody = UnlockProductsRequest;

/** Response of `PUT /product/sellers/{sellerId}/products/unlock`. */
export type UnlockProductsResponse = BatchRequestResponse;

/** Request body for `POST /product/sellers/{sellerId}/products/unapproved-bulk-update`. */
export type UpdateUnapprovedProductsBody = UpdateUnapprovedRequest;

/** Response of `POST /product/sellers/{sellerId}/products/unapproved-bulk-update`. */
export type UpdateUnapprovedProductsResponse = BatchRequestResponse;

/** Request body for `POST /product/sellers/{sellerId}/products/content-bulk-update`. */
export type UpdateContentBulkBody = ContentBulkUpdateRequest;

/** Response of `POST /product/sellers/{sellerId}/products/content-bulk-update`. */
export type UpdateContentBulkResponse = BatchRequestResponse;

/** Request body for `POST /product/sellers/{sellerId}/products/variant-bulk-update`. */
export type UpdateVariantBulkBody = VariantBulkUpdateRequest;

/** Response of `POST /product/sellers/{sellerId}/products/variant-bulk-update`. */
export type UpdateVariantBulkResponse = BatchRequestResponse;

/** Request body for `POST /product/sellers/{sellerId}/products/delivery-info-bulk-update`. */
export type UpdateDeliveryInfoBulkBody = DeliveryInfoBulkUpdateRequest;

/** Response of `POST /product/sellers/{sellerId}/products/delivery-info-bulk-update`. */
export type UpdateDeliveryInfoBulkResponse = BatchRequestResponse;

/** Query parameters for `GET /product/sellers/{sellerId}/products/{contentId}/update-audits`. */
export type GetUpdateAuditsQuery = {
  /** Page number */
  page?: number;
  /** Items per page */
  size?: number;
  /** Update status filter (SUCCESS, FAIL, RUNNING) */
  status?: string;
};

/** Optional headers accepted by `GET /product/sellers/{sellerId}/products/{contentId}/update-audits`. */
export type GetUpdateAuditsHeaders = {
  /** Country code. If not sent, or if TR is sent, the Türkiye storefront is used. */
  storefrontcode?: string;
  /** Language of the service response. On the TR storefront the response is always returned in Turkish. On other storefronts the values tr, en, ro, ar, and el are supported; en is used when the header is omitted or an unsupported value is sent. */
  "Accept-Language"?: string;
};

/** Response of `GET /product/sellers/{sellerId}/products/{contentId}/update-audits`. */
export type GetUpdateAuditsResponse = UpdateAuditsResponse;

/** Request body for `POST /inventory/sellers/{sellerId}/products/price-and-inventory`. */
export type UpdatePriceAndInventoryBody = PriceAndInventoryRequest;

/** Response of `POST /inventory/sellers/{sellerId}/products/price-and-inventory`. */
export type UpdatePriceAndInventoryResponse = BatchRequestResponse;

/** Response of `GET /product/sellers/{sellerId}/products/batch-requests/{batchRequestId}`. */
export type GetBatchRequestResultResponse = BatchRequestResult;

/** Optional headers accepted by `GET /product/lookup/cargo-providers`. */
export type GetCargoProvidersHeaders = {
  /** Country code. If not sent, or if TR is sent, the Türkiye storefront is used. */
  storefrontcode?: string;
};

/** Response of `GET /product/lookup/cargo-providers`. */
export type GetCargoProvidersResponse = CargoProvider[];

