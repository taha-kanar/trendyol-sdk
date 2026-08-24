/* eslint-disable */
/**
 * Trendyol Express Integration
 * Trendyol Express Integration API
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/express.json · regenerate with `npm run generate`.
 */

export interface CompensationTicket {
  /** Cargo Provider */
  cargoProvider?: string;
  /** Compensation Reason */
  compensateReason?: string;
  /**
   * Created Date (Unix timestamp ms)
   * @format int64
   */
  createDate?: number;
  /**
   * State Description
   * - Empty (Your compensation claim has been rejected based on the investigations conducted.)\n
   * - MarkInCompensation (Your compensation claim is being reviewed.)
   * - OpenedForRefund (Your compensation claim is being reviewed.)
   * - StartCompensationFinanceProgress (Your compensation claim has been approved. The amount to be invoiced will be transferred to the Finance > Invoice Listing > Invoices I Need to Issue to Trendyol page within 15 business days at the latest.)
   * - StartCompensationInApprovalProgress (Your compensation claim has been approved. The amount to be invoiced will be transferred to the Finance > Invoice Listing > Invoices I Need to Issue to Trendyol page within 15 business days at the latest.)
   * - CompensationApproved (Your compensation claim has been approved. The amount to be invoiced will be transferred to the Finance > Invoice Listing > Invoices I Need to Issue to Trendyol page within 15 business days at the latest.)
   * - CompensationRejected (Your compensation claim has been approved. The amount to be invoiced will be transferred to the Finance > Invoice Listing > Invoices I Need to Issue to Trendyol page within 15 business days at the latest.)
   * - FoundAfterCompensationComplete (Your shipment has been found and will be returned.)
   * - NotCompensationCase (Your compensation claim has been rejected based on the investigations conducted.)
   * - FoundInCompensation (Your shipment has been found and will be returned.)
   * - FoundInvestigationProgress (Your shipment has been found and will be returned.)
   * - MarkCompensationCancel (Your compensation claim has been rejected based on the investigations conducted.)
   * - CreateCompensationTicket (Your compensation claim is being reviewed.)
   * - FinalizeCompensation (Your compensation claim has been approved. The amount to be invoiced will be transferred to the Finance > Invoice Listing > Invoices I Need to Issue to Trendyol page within 15 business days at the latest.)
   * - CloseCompensationTicket (Your shipment has been found and will be returned.)
   * - FoundInvestigationProgressDeliveredToCustomer (Your shipment has been found and will be delivered to the customer.)
   * - FoundInCompensationDeliveredToCustomer (Your shipment has been found and will be delivered to the customer.)
   * - FoundAfterCompensationCompleteDeliveredToCustomer (Your shipment has been found and will be delivered to the customer.)
   */
  currentState?: "Empty" | "MarkInCompensation" | "OpenedForRefund" | "StartCompensationFinanceProgress" | "StartCompensationInApprovalProgress" | "CompensationApproved" | "CompensationRejected" | "FoundAfterCompensationComplete" | "NotCompensationCase" | "FoundInCompensation" | "FoundInvestigationProgress" | "MarkCompensationCancel" | "CreateCompensationTicket" | "FinalizeCompensation" | "CloseCompensationTicket" | "FoundInvestigationProgressDeliveredToCustomer" | "FoundInCompensationDeliveredToCustomer" | "FoundAfterCompensationCompleteDeliveredToCustomer";
  /** Delivery Number */
  deliveryNumber?: string;
  itemDetails?: CompensationItemDetail[];
  /** Order Number */
  orderNumber?: string;
  /** The person who submitted the request */
  requestedBy?: string;
  /** State Message */
  stateMessage?: string;
  /** Total Amount */
  totalItemsAmount?: string;
}

export interface CompensationItemDetail {
  /**
   * Amount
   * @format float
   */
  itemAmount?: number;
  /** Item Code */
  itemCode?: string;
  /** Count */
  itemCount?: number;
  /** Name */
  itemName?: string;
}

/** Query parameters for `GET /tex/compensation/sellers/{sellerId}/tickets`. */
export type GetCompensationTicketsQuery = {
  /**
   * Start Date (Unix timestamp ms)
   * @format int64
   */
  startDate?: number;
  /**
   * End Date (Unix timestamp ms)
   * @format int64
   */
  endDate?: number;
  /**
   * Page number
   * @default 0
   */
  page?: number;
  /**
   * Page size (max 100)
   * @default 200
   * @maximum 200
   */
  size?: number;
};

/** Response of `GET /tex/compensation/sellers/{sellerId}/tickets`. */
export interface GetCompensationTicketsResponse {
  totalCount?: number;
  /**
   * Spec declares object; the API returns array.
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  data?: CompensationTicket[];
}

