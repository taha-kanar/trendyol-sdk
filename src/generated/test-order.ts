/* eslint-disable */
/**
 * Trendyol Test Order API
 * Test order creation service for test environment
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/test-order.json · regenerate with `npm run generate`.
 */

/** Optional headers accepted by `POST /test/order/orders/core`. */
export type CreateTestOrderHeaders = {
  /**
   * Seller ID
   * @format int64
   */
  sellerID: number;
};

/** Request body for `POST /test/order/orders/core`. */
export interface CreateTestOrderBody {
  customer: {
    /** Customer first name */
    customerFirstName: string;
    /** Customer last name */
    customerLastName: string;
  };
  invoiceAddress: {
    /** Invoice address */
    addressText: string;
    /** City */
    city: string;
    /** Company name (required for corporate invoice) */
    company?: string;
    /** District */
    district: string;
    /** Invoice first name */
    invoiceFirstName: string;
    /** Invoice last name */
    invoiceLastName: string;
    /** Latitude */
    latitude?: string;
    /** Longitude */
    longitude?: string;
    /** Neighborhood */
    neighborhood?: string;
    /** Phone number */
    phone: string;
    /** Postal code */
    postalCode?: string;
    /** Email address */
    email: string;
    /** Tax number (required for corporate invoice) */
    invoiceTaxNumber?: string;
    /** Tax office (required for corporate invoice) */
    invoiceTaxOffice?: string;
  };
  /** Order line items */
  lines: {
    /** Product barcode */
    barcode: string;
    /** Quantity */
    quantity: number;
    /**
     * Discount percentage
     * @format double
     */
    discountPercentage?: number;
  }[];
  seller: {
    /** Seller ID */
    sellerId: number;
  };
  shippingAddress: {
    /** Shipping address */
    addressText: string;
    /** City */
    city: string;
    /** Company name */
    company?: string;
    /** District */
    district: string;
    /** Latitude */
    latitude?: string;
    /** Longitude */
    longitude?: string;
    /** Neighborhood */
    neighborhood?: string;
    /** Phone number */
    phone: string;
    /** Postal code */
    postalCode?: string;
    /** Shipping first name */
    shippingFirstName: string;
    /** Shipping last name */
    shippingLastName: string;
    /** Email address */
    email: string;
  };
  /**
   * Corporate invoice status (if true, company, invoiceTaxNumber and invoiceTaxOffice must be filled in invoiceAddress)
   * @default false
   */
  commercial?: boolean;
  /** Micro export region (AZ or GULF) */
  microRegion?: "AZ" | "GULF";
}

/** Response of `POST /test/order/orders/core`. */
export interface CreateTestOrderResponse {
  /** Created order number */
  orderNumber?: string;
}

/** Optional headers accepted by `PUT /test/order/sellers/{sellerId}/shipment-packages/{packageId}/status`. */
export type UpdateTestOrderStatusHeaders = {
  /**
   * Seller ID
   * @format int64
   */
  sellerID: number;
};

/** Request body for `PUT /test/order/sellers/{sellerId}/shipment-packages/{packageId}/status`. */
export interface UpdateTestOrderStatusBody {
  /** Order lines */
  lines: {
    /**
     * Line ID
     * @format int64
     */
    lineId: number;
    /** Quantity */
    quantity: number;
  }[];
  /** Additional parameters */
  params?: Record<string, string>;
  /**
   * Status to update. Statuses progress sequentially.
   * 
   * - Shipped: Package shipped to cargo
   * - AtCollectionPoint: Package arrived at cargo company's distribution point
   * - Delivered: Package delivered to delivery point
   * - UnDelivered: Package could not be delivered (returned to cargo distribution center)
   * - Returned: Package returned
   */
  status: "Shipped" | "AtCollectionPoint" | "Delivered" | "UnDelivered" | "Returned";
}

/**
 * Response of `PUT /test/order/sellers/{sellerId}/shipment-packages/{packageId}/status`.
 * @example "200 OK"
 */
export type UpdateTestOrderStatusResponse = string;

/** Request body for `PUT /test/order/sellers/{sellerId}/claims/waiting-in-action`. */
export interface UpdateTestClaimToWaitingInActionBody {
  /**
   * Corresponds to the "orderShipmentPackageId" value returned from the getClaims service
   * @format int64
   */
  shipmentPackageId: number;
}

/**
 * Response of `PUT /test/order/sellers/{sellerId}/claims/waiting-in-action`.
 * @example "200 OK"
 */
export type UpdateTestClaimToWaitingInActionResponse = string;

