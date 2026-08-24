import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type { PackageId } from './orders.resource.js';
import type {
  CreateTestOrderBody,
  CreateTestOrderResponse,
  UpdateTestClaimToWaitingInActionBody,
  UpdateTestOrderStatusBody,
} from '../generated/test-order.js';

/**
 * Fabricating orders on the stage environment.
 *
 * These endpoints exist **only** on `stageapigw.trendyol.com`; calling them
 * against production fails. Construct the client with
 * `{ environment: 'stage' }` before using this resource.
 *
 * The service also wants the seller id in a `sellerID` header, which the SDK
 * fills in from the client configuration.
 *
 * @see https://developers.trendyol.com/v2.0/reference/test-orders
 */
export class TestOrdersResource extends BaseResource {
  /**
   * Create a synthetic order with the given lines.
   *
   * @operationId createTestOrder
   */
  create(body: CreateTestOrderBody, options: RequestOptions = {}): Promise<CreateTestOrderResponse> {
    return this.transport.request<CreateTestOrderResponse>({
      operationId: 'createTestOrder',
      method: 'POST',
      path: '/test/order/orders/core',
      body,
      ...this.options(options),
      headers: { sellerid: this.sellerId, ...options.headers },
    });
  }

  /**
   * Force a test package into a given status, skipping the real flow.
   *
   * @operationId updateTestOrderStatus
   */
  updateStatus(packageId: PackageId, body: UpdateTestOrderStatusBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'updateTestOrderStatus',
      method: 'PUT',
      path: '/test/order/sellers/{sellerId}/shipment-packages/{packageId}/status',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
      headers: { sellerid: this.sellerId, ...options.headers },
    });
  }

  /**
   * Move a test claim to `WaitingInAction`, so approval flows can be exercised.
   *
   * @operationId updateTestClaimToWaitingInAction
   */
  claimToWaitingInAction(
    body: UpdateTestClaimToWaitingInActionBody,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'updateTestClaimToWaitingInAction',
      method: 'PUT',
      path: '/test/order/sellers/{sellerId}/claims/waiting-in-action',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }
}
