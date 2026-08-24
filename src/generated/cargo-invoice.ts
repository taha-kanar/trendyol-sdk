/* eslint-disable */
/**
 * Trendyol Domestic Cargo Invoice Details Integration
 * You can access the details of the cargo invoices issued by Trendyol to the sellers through this service.  - **How do I find the serial number of the Shipping Invoice?**   The "Id" value of the records whose transactionType value is "Kargo Faturası" or "Kargo Fatura" from the fields in the data returned from the transactionType='DeductionInvoices' response over the Current Account Statement Integration is the "invoiceSerialNumber" value. 
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/cargo-invoice.json · regenerate with `npm run generate`.
 */

export interface CargoInvoicePageResponse {
  /** Current page number */
  page?: number;
  /** Number of items per page */
  size?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of elements */
  totalElements?: number;
  content?: CargoInvoiceItem[];
}

export interface CargoInvoiceItem {
  /** Shipment package type (e.g., "Gönderi Kargo Bedeli", "İade Kargo Bedeli") */
  shipmentPackageType?: string;
  /**
   * Parcel unique identifier
   * @format int64
   */
  parcelUniqueId?: number;
  /** Order number */
  orderNumber?: string;
  /**
   * Cargo invoice amount
   * @format double
   */
  amount?: number;
  /** Volumetric weight (desi) value */
  desi?: number;
}

/** Query parameters for `GET /sellers/{sellerId}/cargo-invoice/{invoiceSerialNumber}/items`. */
export type GetCargoInvoiceItemsQuery = {
  /**
   * Returns information on the specified page only
   * @default 0
   */
  page?: number;
  /**
   * Specifies the maximum number to be listed on a page.
   * @default 500
   */
  size?: number;
};

/** Response of `GET /sellers/{sellerId}/cargo-invoice/{invoiceSerialNumber}/items`. */
export type GetCargoInvoiceItemsResponse = CargoInvoicePageResponse;

