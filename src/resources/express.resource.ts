import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type { GetCompensationTicketsQuery, GetCompensationTicketsResponse } from '../generated/express.js';

/**
 * Trendyol Express compensation tickets — claims for lost or damaged cargo.
 *
 * @see https://developers.trendyol.com/v2.0/reference/compensation-listing-integration
 */
export class ExpressResource extends BaseResource {
  /**
   * List compensation requests and where each one stands.
   *
   * @operationId getCompensationTickets
   */
  compensationTickets(
    query: GetCompensationTicketsQuery = {},
    options: RequestOptions = {}
  ): Promise<GetCompensationTicketsResponse> {
    return this.transport.request<GetCompensationTicketsResponse>({
      operationId: 'getCompensationTickets',
      method: 'GET',
      path: '/tex/compensation/sellers/{sellerId}/tickets',
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }
}
