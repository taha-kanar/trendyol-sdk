import { toFormData } from '../core/http/form-data.js';
import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  ApproveClaimLineItemsBody,
  CreateClaimBody,
  CreateClaimIssueBody,
  CreateClaimResponse,
  GetClaimIssueReasonsResponse,
  GetClaimItemAuditsResponse,
  GetClaimsQuery,
  GetClaimsResponse,
} from '../generated/marketplace.js';

/** Identifier of a return claim. */
export type ClaimId = number | string;

/**
 * Returns (claims) — listing them, approving them, objecting to them.
 *
 * @see https://developers.trendyol.com/v2.0/reference/returned-orders-integration
 */
export class ClaimsResource extends BaseResource {
  /**
   * List return requests.
   *
   * `claimCreationDate` filters are Unix timestamps in milliseconds and, like
   * order listing, cover at most two weeks per call.
   *
   * @operationId getClaims
   */
  list(query: GetClaimsQuery = {}, options: RequestOptions = {}): Promise<GetClaimsResponse> {
    return this.transport.request<GetClaimsResponse>({
      operationId: 'getClaims',
      method: 'GET',
      path: '/order/sellers/{sellerId}/claims',
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }

  /**
   * Open a return on the customer's behalf.
   *
   * @operationId createClaim
   */
  create(body: CreateClaimBody, options: RequestOptions = {}): Promise<CreateClaimResponse> {
    return this.transport.request<CreateClaimResponse>({
      operationId: 'createClaim',
      method: 'POST',
      path: '/order/sellers/{sellerId}/claims/create',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Approve returned items, releasing the refund.
   *
   * @operationId approveClaimLineItems
   */
  approveItems(claimId: ClaimId, body: ApproveClaimLineItemsBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'approveClaimLineItems',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/claims/{claimId}/items/approve',
      pathParams: { sellerId: this.sellerId, claimId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Reject a return, with evidence.
   *
   * Sent as `multipart/form-data`: `files` may carry photos or a PDF, and
   * `claimItemIdList` is a comma-separated string, not an array — Trendyol's
   * own quirk, preserved here rather than hidden.
   *
   * @operationId createClaimIssue
   */
  createIssue(claimId: ClaimId, body: CreateClaimIssueBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'createClaimIssue',
      method: 'POST',
      path: '/order/sellers/{sellerId}/claims/{claimId}/issue',
      pathParams: { sellerId: this.sellerId, claimId },
      body: toFormData(body),
      ...this.options(options),
    });
  }

  /**
   * List the reason codes accepted by {@link createIssue}.
   *
   * @operationId getClaimIssueReasons
   */
  issueReasons(options: RequestOptions = {}): Promise<GetClaimIssueReasonsResponse> {
    return this.transport.request<GetClaimIssueReasonsResponse>({
      operationId: 'getClaimIssueReasons',
      method: 'GET',
      path: '/order/claim-issue-reasons',
      ...this.options(options),
    });
  }

  /**
   * Status history of a claim item, for auditing a disputed return.
   *
   * @operationId getClaimItemAudits
   */
  itemAudits(claimItemsId: number | string, options: RequestOptions = {}): Promise<GetClaimItemAuditsResponse> {
    return this.transport.request<GetClaimItemAuditsResponse>({
      operationId: 'getClaimItemAudits',
      method: 'GET',
      path: '/order/sellers/{sellerId}/claims/items/{claimItemsId}/audit',
      pathParams: { sellerId: this.sellerId, claimItemsId },
      ...this.options(options),
    });
  }
}
