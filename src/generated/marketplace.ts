/* eslint-disable */
/**
 * Trendyol Marketplace Integration
 * API for Trendyol Domestic Marketplace Order and Return Integration
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/marketplace.json · regenerate with `npm run generate`.
 */

import type { FileInput } from '../core/http/form-data.js';

export interface ShipmentPackage {
  /**
   * Package ID
   * @format int64
   */
  id?: number;
  /**
   * Shipment number
   * @format int64
   * Spec declares string; the API returns number.
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  shipmentNumber?: number;
  /** Order number */
  orderNumber?: string;
  /**
   * Gross amount
   * @format double
   */
  grossAmount?: number;
  /**
   * Total discount
   * @format double
   */
  totalDiscount?: number;
  /**
   * Total Trendyol discount
   * @format double
   */
  totalTyDiscount?: number;
  /** Tax number */
  taxNumber?: string;
  invoiceAddress?: Address;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  /** @format int64 */
  customerId?: number;
  /** Customer TCKN */
  customerTckn?: string;
  shipmentAddress?: Address;
  shipmentPackageStatus?: string;
  status?: "Created" | "Picking" | "Invoiced" | "Shipped" | "Cancelled" | "Delivered" | "UnDelivered" | "Returned";
  deliveryType?: string;
  /** @format int64 */
  timeSlotId?: number;
  /** @format int64 */
  estimatedDeliveryStartDate?: number;
  /** @format int64 */
  estimatedDeliveryEndDate?: number;
  /** @format double */
  totalPrice?: number;
  /** @format int64 */
  agreedDeliveryDate?: number;
  agreedDeliveryDateExtendible?: boolean;
  /** @format int64 */
  agreedDeliveryExtensionStartDate?: number;
  /** @format int64 */
  agreedDeliveryExtensionEndDate?: number;
  /** @format int64 */
  extendedAgreedDeliveryDate?: number;
  /** @format double */
  deci?: number;
  /**
   * @format int64
   * Spec declares string; the API returns number.
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  cargoTrackingNumber?: number;
  cargoTrackingLink?: string;
  cargoSenderNumber?: string;
  cargoProviderName?: string;
  /** @format int64 */
  cargoProviderId?: number;
  lines?: OrderLine[];
  packageHistory?: {
    /** @format int64 */
    createdDate?: number;
    status?: string;
  }[];
  warehouseId?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  orderCountryCode?: string;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  packageGrossAmount?: number;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  packageSellerDiscount?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  packageTyDiscount?: number;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  packageTotalDiscount?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  discountDisplays?: {
    displayName?: string;
    /** @format double */
    discountAmount?: number;
  }[];
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  supplierId?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  channelId?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  shipmentPackageId?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  sellerDeliveryMethod?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  sellerOtpCode?: string;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  orderDate?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  identityNumber?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  currencyCode?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  packageHistories?: {
    /** @format int64 */
    createdDate?: number;
    status?: string;
  }[];
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  packageTotalPrice?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  deliveryAddressType?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  fastDelivery?: boolean;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  originShipmentDate?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  lastModifiedDate?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  commercial?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  fastDeliveryType?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  deliveredByService?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  invoiceStatus?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  invoiceNumber?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  micro?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  giftBoxRequested?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  "3pByTrendyol"?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  containsDangerousProduct?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  isCod?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  createdBy?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  originPackageIds?: unknown;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  is4P?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  invoiceLink?: string;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  cargoDeci?: number;
}

export interface OrderLine {
  /** @format int64 */
  id?: number;
  productSize?: string;
  productColor?: string;
  merchantSku?: string;
  productName?: string;
  /** @format int64 */
  productCode?: number;
  /** @format int64 */
  merchantId?: number;
  /** @format double */
  amount?: number;
  /** @format double */
  discount?: number;
  /** @format double */
  tyDiscount?: number;
  currencyCode?: string;
  productCategory?: string;
  shipmentType?: string;
  gift?: boolean;
  fastDelivery?: boolean;
  fastDeliveryType?: string;
  sku?: string;
  /** @format double */
  vatBaseAmount?: number;
  barcode?: string;
  orderLineItemStatusName?: string;
  /** @format double */
  price?: number;
  quantity?: number;
  fastDeliveryOptions?: string[];
  /** @format int64 */
  salesCampaignId?: number;
  productSellerCode?: string;
  deliveryFeeType?: string;
  /** @format double */
  laborCostPerItem?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  stockCode?: string;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  contentId?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  sellerId?: number;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  lineGrossAmount?: number;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  lineTotalDiscount?: number;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  lineSellerDiscount?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  lineTyDiscount?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  discountDetails?: {
    /** @format double */
    lineItemPrice?: number;
    /** @format double */
    lineItemDiscount?: number;
    /** @format double */
    lineItemSellerDiscount?: number;
    /** @format int64 */
    lineItemTyDiscount?: number;
  }[];
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  lineId?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  vatRate?: number;
  /**
   * @format double
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  lineUnitPrice?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  productCategoryId?: number;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  commission?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  businessUnit?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  defectiveClaimListingInsight?: string;
}

export interface Address {
  /** @format int64 */
  id?: number;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  cityCode?: number;
  district?: string;
  districtId?: number;
  postalCode?: string;
  countryCode?: string;
  neighborhoodId?: number;
  neighborhood?: string;
  fullName?: string;
  fullAddress?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  company?: string;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  countyId?: number;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  countyName?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  shortAddress?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  stateName?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  addressLines?: {
    addressLine1?: string;
    addressLine2?: string;
  };
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  phone?: unknown;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  sector?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  taxOffice?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  taxNumber?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  isEInvoiceAvailable?: boolean;
}

export interface Claim {
  /** @format int64 */
  id?: number;
  customerFirstName?: string;
  customerLastName?: string;
  /** @format int64 */
  customerId?: number;
  orderNumber?: string;
  /** @format int64 */
  orderDate?: number;
  /** @format int64 */
  createdDate?: number;
  /** @format int64 */
  lastModifiedDate?: number;
  items?: {
    /** @format int64 */
    id?: number;
    /** @format int64 */
    orderLineId?: number;
    productName?: string;
    productSize?: string;
    productColor?: string;
    barcode?: string;
    status?: string;
    customerNote?: string;
  }[];
}

/** Query parameters for `GET /order/sellers/{sellerId}/orders`. */
export type GetShipmentPackagesQuery = {
  /**
   * Start date (Unix timestamp in milliseconds)
   * @format int64
   */
  startDate?: number;
  /**
   * End date (Unix timestamp in milliseconds)
   * @format int64
   */
  endDate?: number;
  /**
   * Page number
   * @default 0
   */
  page?: number;
  /**
   * Page size (maximum 200)
   * @default 200
   * @maximum 200
   */
  size?: number;
  /** Filter by order number */
  orderNumber?: string;
  /** Filter by package status */
  status?: "Awaiting" | "Created" | "Picking" | "Invoiced" | "Shipped" | "Cancelled" | "Delivered" | "UnDelivered" | "Returned" | "AtCollectionPoint" | "UnSupplied";
  /** Sort field */
  orderByField?: "PackageLastModifiedDate" | "CreatedDate";
  /** Sort direction */
  orderByDirection?: "ASC" | "DESC";
  /** Filter by package IDs (maximum 50) */
  shipmentPackageIds?: number[];
};

/** Response of `GET /order/sellers/{sellerId}/orders`. */
export interface GetShipmentPackagesResponse {
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
  content?: ShipmentPackage[];
}

/** Query parameters for `GET /order/sellers/{sellerId}/orders/stream`. */
export type GetShipmentPackagesStreamQuery = {
  /**
   * Maximum number of packages to return per request (default 50, maximum 200)
   * @default 50
   * @maximum 200
   */
  size?: number;
  /** Opaque token used to fetch the next page. Must not be sent in the first request. Use the nextCursor value from the response as-is. */
  nextCursor?: string;
  /**
   * Filter by package item statuses. Multiple statuses can be sent separated by commas.
   * Valid values: Created, Picking, Invoiced, Shipped, Cancelled, Delivered, UnDelivered, Returned, UnSupplied, AtCollectionPoint, UnPacked, Awaiting
   */
  packageItemStatuses?: string;
  /**
   * Fetch packages modified after this date (Unix timestamp in milliseconds)
   * @format int64
   */
  lastModifiedStartDate?: number;
  /**
   * Fetch packages modified before this date (Unix timestamp in milliseconds)
   * @format int64
   */
  lastModifiedEndDate?: number;
};

/** Response of `GET /order/sellers/{sellerId}/orders/stream`. */
export interface GetShipmentPackagesStreamResponse {
  content?: ShipmentPackage[];
  /** Number of packages in the current response */
  size?: number;
  /** Indicates whether more data is available. If true, the next page exists. */
  hasMore?: boolean;
  /** Cursor value to use for fetching the next page. Empty when hasMore is false. */
  nextCursor?: string;
}

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}`. */
export interface UpdatePackageStatusBody {
  /** New package status */
  status: "Picking" | "Invoiced";
  /** Order line pairs for package updates */
  lines?: {
    /** @format int64 */
    lineId?: number;
    quantity?: number;
  }[];
  /** Additional parameters as key-value pairs. Can include invoiceNumber but should be given only for Invoiced status. */
  params?: Record<string, string>;
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}` returns no response body. */
export type UpdatePackageStatusResponse = void;

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/items/unsupplied`. */
export interface CancelOrderPackageItemBody {
  lines: {
    /**
     * Order line ID to cancel
     * @format int64
     */
    lineId: number;
    /** Quantity to cancel */
    quantity: number;
  }[];
  /** Cancellation reason ID */
  reasonId: 500 | 501 | 502 | 504 | 505 | 506;
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/items/unsupplied` returns no response body. */
export type CancelOrderPackageItemResponse = void;

/** Request body for `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/split-packages`. */
export interface SplitMultiPackagesByQuantityBody {
  /** Array of package groups to create */
  splitPackages: {
    /** Order lines with quantities to include in this package */
    packageDetails: {
      /**
       * Order line ID
       * @format int64
       */
      orderLineId: number;
      /** Quantity for this order line */
      quantities: number;
    }[];
  }[];
}

/** `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/split-packages` returns no response body. */
export type SplitMultiPackagesByQuantityResponse = void;

/** Request body for `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/split`. */
export interface SplitShipmentPackageBody {
  /** Order line IDs to split into new package */
  orderLineIds: number[];
}

/** Response of `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/split`. */
export interface SplitShipmentPackageResponse {
  /**
   * Newly created package ID
   * @format int64
   */
  newPackageId?: number;
}

/** Request body for `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/quantity-split`. */
export interface SplitShipmentPackageByQuantityBody {
  /** Quantity split requests for each order line */
  quantitySplit: {
    /**
     * Order line ID to split
     * @format int64
     */
    orderLineId: number;
    /** Array of quantities to split into separate packages */
    quantities: number[];
  }[];
}

/** Response of `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/quantity-split`. */
export interface SplitShipmentPackageByQuantityResponse {
  /** Array of newly created package IDs */
  newPackageIds?: number[];
}

/** Request body for `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/multi-split`. */
export interface MultiSplitShipmentPackageBody {
  /** Groups of order line IDs to split into separate packages */
  splitGroups: {
    /** Order line IDs to group together in a new package */
    orderLineIds: number[];
  }[];
}

/** Response of `POST /order/sellers/{sellerId}/shipment-packages/{packageId}/multi-split`. */
export interface MultiSplitShipmentPackageResponse {
  results?: {
    /** @format int64 */
    newPackageId?: number;
  }[];
}

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/box-info`. */
export interface UpdateBoxInfoBody {
  /**
   * Deci value
   * @format double
   */
  deci?: number;
  /** Box Quantity */
  boxQuantity?: number;
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/box-info` returns no response body. */
export type UpdateBoxInfoResponse = void;

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery`. */
export interface ProcessAlternativeDeliveryBody {
  /**
   * If false, trackingInfo should be a cargo tracking link. If true, trackingInfo should be a phone number.
   * @example false
   */
  isPhoneNumber: boolean;
  /**
   * Cargo tracking link (if isPhoneNumber is false) or phone number (if isPhoneNumber is true)
   * @example "http://tex...."
   */
  trackingInfo: string;
  /** Additional parameters */
  params: Record<string, string>;
  /**
   * The quantity of the package (optional)
   * @example 1
   */
  boxQuantity?: number;
  /**
   * The deci of the package (optional)
   * @format float
   * @example 1.4
   */
  deci?: number;
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery` returns no response body. */
export type ProcessAlternativeDeliveryResponse = void;

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery-digital`. */
export interface ProcessAlternativeDeliveryDigitalBody {
  /**
   * Should be true for digital product delivery
   * @example true
   */
  isPhoneNumber: boolean;
  /**
   * Contact phone number for customer
   * @example "5555555555"
   */
  trackingInfo: string;
  /** Additional parameters including digital code */
  params: {
    /**
     * Digital code must be between 6-120 characters
     * @example "AX4567fasdf"
     */
    digitalCode: string;
  };
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery-digital` returns no response body. */
export type ProcessAlternativeDeliveryDigitalResponse = void;

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/manual-invoice-delivery` returns no response body. */
export type ManualDeliverByPackageIdResponse = void;

/** `PUT /order/sellers/{sellerId}/shipment-packages/manual-invoice-delivery-by-tracking-number/{cargoTrackingNumber}` returns no response body. */
export type ManualDeliverByTrackingNumberResponse = void;

/** `PUT /order/sellers/{sellerId}/shipment-packages/manual-return-by-tracking-number/{cargoTrackingNumber}` returns no response body. */
export type ManualReturnByTrackingNumberResponse = void;

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/manual-return` returns no response body. */
export type ManualReturnByPackageIdResponse = void;

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/delivered-by-service` returns no response body. */
export type DeliveredByServiceResponse = void;

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/cargo-providers`. */
export interface ChangeCargoProviderBody {
  /** Cargo provider code */
  cargoProvider: "YKMP" | "ARASMP" | "SURATMP" | "HOROZMP" | "DHLECOMMP" | "PTTMP" | "CEVAMP" | "TEXMP" | "UPSMP" | "KOLAYGELSINMP" | "CEVATEDARIK";
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/cargo-providers` returns no response body. */
export type ChangeCargoProviderResponse = void;

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/warehouse`. */
export interface UpdateWarehouseBody {
  /** Warehouse ID */
  warehouseId: number;
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/warehouse` returns no response body. */
export type UpdateWarehouseResponse = void;

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/extended-agreed-delivery-date`. */
export interface ExtendAgreedDeliveryDateBody {
  /** Number of days to extend (can be 1, 2, or 3) */
  extendedDayCount: 1 | 2 | 3;
}

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/extended-agreed-delivery-date` returns no response body. */
export type ExtendAgreedDeliveryDateResponse = void;

/** Response of `GET /member/countries`. */
export type GetCountriesResponse = {
  id?: number;
  code?: string;
  name?: string;
}[];

/** Response of `GET /member/countries/{CountryCode}/cities`. */
export type GetCitiesByCountryResponse = {
  id?: number;
  name?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  primaryName?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  secondaryName?: string;
}[];

/** Response of `GET /member/countries/{CountryCode}/cities/{cityId}/districts`. */
export type GetDistrictsByCityResponse = {
  id?: number;
  name?: string;
}[];

/** Response of `GET /member/countries/domestic/AZ/cities`. */
export type GetAzerbaijanCitiesResponse = {
  id?: number;
  name?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  code?: string;
}[];

/** Response of `GET /member/countries/domestic/AZ/cities/{cityCode}/districts`. */
export type GetAzerbaijanDistrictsResponse = {
  id?: number;
  name?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  code?: string;
}[];

/** Response of `GET /member/countries/domestic/TR/cities`. */
export type GetTurkeyCitiesResponse = {
  id?: number;
  name?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  code?: string;
}[];

/** Response of `GET /member/countries/domestic/TR/cities/{CityCode}/districts`. */
export type GetTurkeyDistrictsResponse = {
  id?: number;
  name?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  code?: string;
}[];

/** Response of `GET /member/countries/domestic/TR/cities/{CityCode}/districts/{DistrictCode}/neighborhoods`. */
export type GetTurkeyNeighborhoodsResponse = {
  id?: number;
  name?: string;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  postCode?: string;
}[];

/** Request body for `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/labor-costs`. */
export type UpdateLaborCostsBody = {
  /** @format int64 */
  orderLineId: number;
  /**
   * Labor cost per single item
   * @format double
   */
  laborCostPerItem: number;
}[];

/** `PUT /order/sellers/{sellerId}/shipment-packages/{packageId}/labor-costs` returns no response body. */
export type UpdateLaborCostsResponse = void;

/** Query parameters for `GET /order/sellers/{sellerId}/claims`. */
export type GetClaimsQuery = {
  /** @format int64 */
  startDate?: number;
  /** @format int64 */
  endDate?: number;
  /** @default 0 */
  page?: number;
  /**
   * @default 50
   * @maximum 200
   */
  size?: number;
  claimItemStatus?: "Created" | "WaitingInAction" | "WaitingFraudCheck" | "Accepted" | "Unresolved" | "Rejected" | "Cancelled" | "InAnalysis";
  /** The order number of the claim package */
  orderNumber?: string;
  claimIds?: number[];
};

/** Response of `GET /order/sellers/{sellerId}/claims`. */
export interface GetClaimsResponse {
  /** Total number of elements */
  totalElements?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Current page number */
  page?: number;
  /** Page size */
  size?: number;
  /** Array of claim objects */
  content?: {
    /** Claim ID */
    id?: string;
    /** Claim ID */
    claimId?: string;
    /** Order number */
    orderNumber?: string;
    /**
     * Order date (timestamp)
     * @format int64
     */
    orderDate?: number;
    /** Customer first name */
    customerFirstName?: string;
    /** Customer last name */
    customerLastName?: string;
    /**
     * Claim date (timestamp in GMT)
     * @format int64
     */
    claimDate?: number;
    /**
     * Cargo tracking number
     * @format int64
     */
    cargoTrackingNumber?: number;
    /** Cargo tracking link */
    cargoTrackingLink?: string;
    /** Cargo sender number */
    cargoSenderNumber?: string;
    /** Cargo provider name */
    cargoProviderName?: string;
    /**
     * Order shipment package ID
     * @format int64
     */
    orderShipmentPackageId?: number;
    /** Replacement outbound package information (empty if no replacement) */
    replacementOutboundpackageinfo?: {
      /** @format int64 */
      cargoTrackingNumber?: number;
      cargoProviderName?: string;
      cargoSenderNumber?: string;
      cargoTrackingLink?: string;
      /**
       * Replacement packet ID information
       * @format int64
       */
      packageid?: number;
      /** Array of claim item IDs */
      items?: string[];
    };
    /** Rejected package information (if available) */
    rejectedpackageinfo?: {
      /** @format int64 */
      cargoTrackingNumber?: number;
      cargoSenderNumber?: string;
      cargoProviderName?: string;
      cargoTrackingLink?: string;
      /**
       * Rejected return package ID
       * @format int64
       */
      packageid?: number;
      /** Array of claim item IDs */
      items?: string[];
      /** Indicates that the product should not be shipped back */
      dontShipBack?: boolean;
    };
    /** Array of order line items */
    items?: {
      orderLine?: {
        /** @format int64 */
        id?: number;
        productName?: string;
        barcode?: string;
        merchantSku?: string;
        productColor?: string;
        productSize?: string;
        /** @format double */
        price?: number;
        /** @format double */
        vatBaseAmount?: number;
        /** @format double */
        vatRate?: number;
        /** @format int64 */
        salesCampaignId?: number;
        productCategory?: string;
        /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
        lineItems?: unknown;
      };
      claimItems?: {
        /** Claim line item ID */
        id?: string;
        /** @format int64 */
        orderLineItemId?: number;
        customerClaimItemReason?: {
          name?: string;
          externalReasonId?: number;
          code?: string;
          /**
           * @format int64
           * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
           */
          id?: number;
        };
        trendyolClaimItemReason?: {
          name?: string;
          externalReasonId?: number;
          code?: string;
          /**
           * @format int64
           * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
           */
          id?: number;
        };
        claimItemStatus?: {
          /** Status name */
          name?: string;
        };
        note?: string;
        customerNote?: string;
        resolved?: boolean;
        /** Returns which are waiting in actions for 48 hours are automatically accepted by the system */
        autoAccepted?: boolean;
        /** Returns accepted by the seller */
        acceptedBySeller?: boolean;
        /** SUPPLIER, DISPUTE, or SYSTEM */
        acceptDetail?: string;
        /**
         * @format int64
         * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
         */
        autoApproveDate?: number;
      }[];
    }[];
    /**
     * Last modified date (timestamp)
     * @format int64
     */
    lastModifiedDate?: number;
    /**
     * Order outbound package ID
     * @format int64
     */
    orderOutboundPackageId?: number;
    /**
     * @format int64
     * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
     */
    channelId?: number;
    /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
    rejectedPackageInfo?: {
      /** @format int64 */
      cargoTrackingNumber?: number;
      /** @format int64 */
      packageId?: number;
      cargoProviderName?: string;
      cargoTrackingLink?: string;
      items?: string[];
      cargoSenderNumber?: string;
      dontShipBack?: boolean;
      sellerOtp?: string;
      sellerDeliveryMethod?: string;
    };
    /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
    sellerOtp?: string;
    /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
    sellerDeliveryMethod?: string;
    /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
    sellerCollectionPointDetails?: {
      collectionPointId?: string;
    };
  }[];
}

/** Request body for `POST /order/sellers/{sellerId}/claims/create`. */
export interface CreateClaimBody {
  claimItems: {
    /**
     * It is the barcode information of the product in the order.
     * @example "string"
     */
    barcode: string;
    /**
     * It is the field written by customers. If you wish, you can feed this field with a text such as "Return without return code".
     * @example "string"
     */
    customerNote?: string;
    /**
     * It is the quantity information of the product you want to create a return request.
     * @example 0
     */
    quantity: number;
    /**
     * These are the reasons for return selected by customers on trendyol.com. You can feed this id value as "I give up" with 401 id value for now.
     * @example 401
     */
    reasonId: number;
  }[];
  /**
   * It is the id value of the customer who take the order on Trendyol.
   * @format int64
   * @example 0
   */
  customerId?: number;
  /**
   * Exclude from listing
   * @example true
   */
  excludeListing?: boolean;
  /**
   * Force package creation
   * @example true
   */
  forcePackageCreation?: boolean;
  /**
   * The number of the order.
   * @example "string"
   */
  orderNumber: string;
  /**
   * You can use the id value of the cargo company you have worked with.
   * @example 4
   */
  shipmentCompanyId?: number;
}

/** Response of `POST /order/sellers/{sellerId}/claims/create`. */
export interface CreateClaimResponse {
  /** The created claim ID */
  claimId?: string;
  /**
   * Cargo tracking number for the return
   * @format int64
   */
  cargoTrackingNumber?: number;
  /** Array of created claim item IDs */
  claimItemIds?: string[];
}

/** Request body for `PUT /order/sellers/{sellerId}/claims/{claimId}/items/approve`. */
export interface ApproveClaimLineItemsBody {
  /** Array of claim line item IDs to approve */
  claimLineItemIdList: string[];
  /** Additional parameters */
  params?: Record<string, string>;
}

/** `PUT /order/sellers/{sellerId}/claims/{claimId}/items/approve` returns no response body. */
export type ApproveClaimLineItemsResponse = void;

/** Request body for `POST /order/sellers/{sellerId}/claims/{claimId}/issue`. */
export interface CreateClaimIssueBody {
  /**
   * Claim issue reason ID
   * @format int64
   */
  claimIssueReasonId: number;
  /** Comma-separated list of claim item IDs */
  claimItemIdList: string;
  /** Description of the rejection */
  description: string;
  /** Attachments (pdf, jpeg, etc.) */
  files?: FileInput[];
}

/** `POST /order/sellers/{sellerId}/claims/{claimId}/issue` returns no response body. */
export type CreateClaimIssueResponse = void;

/** Response of `GET /order/claim-issue-reasons`. */
export type GetClaimIssueReasonsResponse = {
  /** Reason ID */
  id?: number;
  /** Reason name in Turkish */
  name?: string;
}[];

/** Response of `GET /order/sellers/{sellerId}/claims/items/{claimItemsId}/audit`. */
export type GetClaimItemAuditsResponse = {
  /** Claim ID */
  claimId?: string;
  /** Claim item ID */
  claimItemId?: string;
  /** Previous status of the claim item */
  previousStatus?: string;
  /** New status of the claim item */
  newStatus?: string;
  userInfoDocument?: {
    /** Executor ID */
    executorId?: string;
    /** Shows from which platform the transaction was made */
    executorApp?: string;
    /** Shows which user the action was taken by */
    executorUser?: string;
  };
  /**
   * Update date timestamp
   * @format int64
   */
  date?: number;
}[];

