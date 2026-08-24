/* eslint-disable */
/**
 * Trendyol Marketplace - Supplier Information Integration
 * Trendyol Supplier Address Information Integration API
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/supplier-address.json · regenerate with `npm run generate`.
 */

/** Supplier address information */
export interface SupplierAddress {
  /**
   * Address ID
   * @format int64
   */
  id?: number;
  /** Address type (Shipment, Invoice or Return) */
  addressType?: "Shipment" | "Invoice" | "Returning";
  /** Country */
  country?: string;
  /** City */
  city?: string;
  /** City code */
  cityCode?: number;
  /** District */
  district?: string;
  /** District ID */
  districtId?: number;
  /** Postal code */
  postCode?: string;
  /** Address */
  address?: string;
  /** Is this a return address? */
  isReturningAddress?: boolean;
  /** Full address */
  fullAddress?: string;
  /** Is this a shipment address? */
  isShipmentAddress?: boolean;
  /** Is this an invoice address? */
  isInvoiceAddress?: boolean;
  /** Is this the default address? */
  isDefault?: boolean;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  stateCountyProvince?: unknown;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  buildingNumber?: unknown;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  shortAddress?: unknown;
}

/** Optional headers accepted by `GET /sellers/{sellerId}/addresses`. */
export type GetSuppliersAddressesHeaders = {
  /**
   * Country code where the seller operates. If not provided, defaults to "TR". Returns address information for the specified country/region.
   * @default "TR"
   */
  storeFrontCode?: string;
};

/** Response of `GET /sellers/{sellerId}/addresses`. */
export interface GetSuppliersAddressesResponse {
  /** Supplier address list */
  supplierAddresses?: SupplierAddress[];
  defaultShipmentAddress?: SupplierAddress;
  defaultInvoiceAddress?: SupplierAddress;
  defaultReturningAddress?: {
    /** Indicates whether a default return address is available */
    present?: boolean;
  };
}

