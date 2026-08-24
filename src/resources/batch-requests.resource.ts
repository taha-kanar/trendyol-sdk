import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type { GetBatchRequestResultResponse } from '../generated/product.js';

/**
 * Results of asynchronous catalogue writes.
 *
 * Every product create/update returns a `batchRequestId`; this is where you
 * find out what actually happened to each item.
 *
 * @see https://developers.trendyol.com/v2.0/reference/batchrequests
 */
export class BatchRequestsResource extends BaseResource {
  /**
   * Status and per-item outcome of a batch request.
   *
   * Results are not instant — Trendyol recommends waiting ~30 seconds after
   * submitting before the first poll, and batches expire after some time.
   *
   * @operationId getBatchRequestResult
   */
  result(batchRequestId: string, options: RequestOptions = {}): Promise<GetBatchRequestResultResponse> {
    return this.transport.request<GetBatchRequestResultResponse>({
      operationId: 'getBatchRequestResult',
      method: 'GET',
      path: '/product/sellers/{sellerId}/products/batch-requests/{batchRequestId}',
      pathParams: { sellerId: this.sellerId, batchRequestId },
      ...this.options(options),
    });
  }
}
