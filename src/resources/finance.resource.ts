import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  GetOtherFinancialsQuery,
  GetOtherFinancialsResponse,
  GetSettlementsQuery,
  GetSettlementsResponse,
} from '../generated/finance.js';
import type { GetCargoInvoiceItemsQuery, GetCargoInvoiceItemsResponse } from '../generated/cargo-invoice.js';

/**
 * The finance services sit behind their own gateway prefix
 * (`.../integration/finance/che`), so it is spelled out in the paths below.
 */
const PREFIX = '/finance/che';

/**
 * Current-account statements: settlements, deductions and cargo invoices.
 *
 * Date windows are Unix timestamps in milliseconds and are capped at 15 days
 * per call, so reconciliation jobs must page through longer periods.
 *
 * @see https://developers.trendyol.com/v2.0/reference/settlements
 */
export class FinanceResource extends BaseResource {
  /**
   * Sales, returns, discounts, coupons and provisions.
   *
   * @operationId getSettlements
   */
  settlements(query: GetSettlementsQuery, options: RequestOptions = {}): Promise<GetSettlementsResponse> {
    return this.transport.request<GetSettlementsResponse>({
      operationId: 'getSettlements',
      method: 'GET',
      path: `${PREFIX}/sellers/{sellerId}/settlements`,
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }

  /**
   * Everything that is not a settlement: commissions, financing, transfers.
   *
   * @operationId getOtherFinancials
   */
  otherFinancials(
    query: GetOtherFinancialsQuery,
    options: RequestOptions = {}
  ): Promise<GetOtherFinancialsResponse> {
    return this.transport.request<GetOtherFinancialsResponse>({
      operationId: 'getOtherFinancials',
      method: 'GET',
      path: `${PREFIX}/sellers/{sellerId}/otherfinancials`,
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }

  /**
   * Line items of a cargo invoice, by its serial number.
   *
   * @operationId getCargoInvoiceItems
   */
  cargoInvoiceItems(
    invoiceSerialNumber: string,
    query: GetCargoInvoiceItemsQuery = {},
    options: RequestOptions = {}
  ): Promise<GetCargoInvoiceItemsResponse> {
    return this.transport.request<GetCargoInvoiceItemsResponse>({
      operationId: 'getCargoInvoiceItems',
      method: 'GET',
      path: `${PREFIX}/sellers/{sellerId}/cargo-invoice/{invoiceSerialNumber}/items`,
      pathParams: { sellerId: this.sellerId, invoiceSerialNumber },
      query,
      ...this.options(options),
    });
  }
}
