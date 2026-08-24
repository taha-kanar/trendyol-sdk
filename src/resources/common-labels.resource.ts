import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type { CreateCommonLabelBody, GetCommonLabelResponse } from '../generated/common-label.js';

/**
 * Common label barcodes — the shipping label Trendyol prints for a package.
 *
 * Create first, then read: the label is generated asynchronously, so a `GET`
 * immediately after the `POST` can still 404.
 *
 * @see https://developers.trendyol.com/v2.0/reference/common-label-barcode-create-integration
 */
export class CommonLabelsResource extends BaseResource {
  /**
   * Request a label for a cargo tracking number.
   *
   * @operationId createCommonLabel
   */
  create(
    cargoTrackingNumber: number | string,
    body: CreateCommonLabelBody,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'createCommonLabel',
      method: 'POST',
      path: '/sellers/{sellerId}/common-label/{cargoTrackingNumber}',
      pathParams: { sellerId: this.sellerId, cargoTrackingNumber },
      body,
      ...this.options(options),
    });
  }

  /**
   * Fetch a generated label (ZPL / base64 payload).
   *
   * @operationId getCommonLabel
   */
  get(cargoTrackingNumber: number | string, options: RequestOptions = {}): Promise<GetCommonLabelResponse> {
    return this.transport.request<GetCommonLabelResponse>({
      operationId: 'getCommonLabel',
      method: 'GET',
      path: '/sellers/{sellerId}/common-label/{cargoTrackingNumber}',
      pathParams: { sellerId: this.sellerId, cargoTrackingNumber },
      ...this.options(options),
    });
  }
}
