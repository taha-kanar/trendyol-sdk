/* eslint-disable */
/**
 * Trendyol Domestic Current Account Statement Integration
 * API for Trendyol Domestic Marketplace Current Account Statement (CHE) Integration. You can get your financial records created in Trendyol system through integration with this service.  - Financial records are created after the order is delivered. - TransactionType must be entered. Only 1 type can be entered in 1 request. - The paymentOrderId is formed after the order has been paid. Except for exceptions, a payment order is created every Wednesday for orders that are due in the relevant week. - With paymentOrderId, you can match your orders and payments. - The start and end date are required and the interval between cannot be longer than **15 days**. - Store information is used by Market vendors. It will return "null" for Marketplace vendors. - "affiliate" field can return "TRENDYOLTR" or "TRENDYOLAZJV".  **Services to be used (settlements, otherfinancials) provide separate transaction records.** - From "Settlements" service: sales, returns, discounts, coupons, and provision transactions. - From "Other Financial" service: supplier financing, transfers, payments, invoices, supplier invoices, incoming transfers, commission reconciliation invoices. 
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/finance.json · regenerate with `npm run generate`.
 */

export interface SettlementPageResponse {
  /** Current page number */
  page?: number;
  /** Number of items per page */
  size?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of elements */
  totalElements?: number;
  content?: FinancialTransaction[];
}

export interface FinancialTransaction {
  /** Transaction ID */
  id?: string;
  /**
   * Transaction date (Unix timestamp in milliseconds)
   * @format int64
   */
  transactionDate?: number;
  /** Product barcode */
  barcode?: string | null;
  /** Transaction type (e.g., Satış, Ödeme) */
  transactionType?: string;
  /**
   * Receipt ID
   * @format int64
   */
  receiptId?: number | null;
  /** Transaction description */
  description?: string | null;
  /**
   * Debt amount
   * @format double
   */
  debt?: number;
  /**
   * Credit amount
   * @format double
   */
  credit?: number;
  /** Payment period in days */
  paymentPeriod?: number | null;
  /**
   * Commission rate
   * @format double
   */
  commissionRate?: number | null;
  /**
   * Commission amount
   * @format double
   */
  commissionAmount?: number | null;
  /** Commission invoice serial number */
  commissionInvoiceSerialNumber?: string | null;
  /**
   * Seller revenue amount
   * @format double
   */
  sellerRevenue?: number | null;
  /** Order number */
  orderNumber?: string | null;
  /**
   * Payment order ID
   * @format int64
   */
  paymentOrderId?: number | null;
  /**
   * Payment date (Unix timestamp in milliseconds)
   * @format int64
   */
  paymentDate?: number | null;
  /**
   * Seller ID
   * @format int64
   */
  sellerId?: number;
  /**
   * Store ID
   * @format int64
   */
  storeId?: number | null;
  /** Store name */
  storeName?: string | null;
  /** Store address */
  storeAddress?: string | null;
  /** Country */
  country?: string;
  /**
   * Order date (Unix timestamp in milliseconds)
   * @format int64
   */
  orderDate?: number | null;
  /** Affiliate code (TRENDYOLTR or TRENDYOLAZJV) */
  affiliate?: string;
  /**
   * Shipment package ID
   * @format int64
   */
  shipmentPackageId?: number | null;
  /** @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24). */
  currency?: string;
}

/** Query parameters for `GET /sellers/{sellerId}/settlements`. */
export type GetSettlementsQuery = {
  /** Type of financial transaction */
  transactionType: "Sale" | "Return" | "Discount" | "DiscountCancel" | "Coupon" | "CouponCancel" | "ProvisionPositive" | "ProvisionNegative" | "ManuelRefund" | "ManualRefundCancel" | "TYDiscount" | "TYDiscountCancel" | "TYCoupon" | "TYCouponCancel" | "SellerRevenuePositive" | "SellerRevenueNegative" | "CommissionPositive" | "CommissionNegative" | "SellerRevenuePositiveCancel" | "SellerRevenueNegativeCancel" | "CommissionPositiveCancel" | "CommissionNegativeCancel";
  /**
   * Returns transaction records after a certain date. Timestamp should be sent in milliseconds.
   * @format int64
   */
  startDate: number;
  /**
   * Returns transaction records before a certain date. Timestamp should be sent in milliseconds.
   * @format int64
   */
  endDate: number;
  /**
   * Returns information on the specified page only
   * @default 0
   */
  page?: number;
  /**
   * Specifies the maximum number to be listed on a page.
   * @default 500
   */
  size?: 500 | 1000;
};

/** Response of `GET /sellers/{sellerId}/settlements`. */
export type GetSettlementsResponse = SettlementPageResponse;

/** Query parameters for `GET /sellers/{sellerId}/otherfinancials`. */
export type GetOtherFinancialsQuery = {
  /** Type of financial transaction */
  transactionType: "Stoppage" | "CashAdvance" | "WireTransfer" | "IncomingTransfer" | "ReturnInvoice" | "CommissionAgreementInvoice" | "PaymentOrder" | "DeductionInvoices" | "FinancialItem";
  /**
   * Returns transaction records after a certain date. Timestamp should be sent in milliseconds.
   * @format int64
   */
  startDate: number;
  /**
   * Returns transaction records before a certain date. Timestamp should be sent in milliseconds.
   * @format int64
   */
  endDate: number;
  /**
   * Returns information on the specified page only
   * @default 0
   */
  page?: number;
  /**
   * Specifies the maximum number to be listed on a page.
   * @default 500
   */
  size?: 500 | 1000;
};

/** Response of `GET /sellers/{sellerId}/otherfinancials`. */
export type GetOtherFinancialsResponse = SettlementPageResponse;

