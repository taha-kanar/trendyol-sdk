import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type { PackageId } from './orders.resource.js';
import type {
  ProcessAlternativeDeliveryBody,
  ProcessAlternativeDeliveryDigitalBody,
} from '../generated/marketplace.js';

/** A cargo tracking number (`cargoTrackingNumber`). */
export type CargoTrackingNumber = number | string;

/**
 * Deliveries that bypass the standard cargo flow.
 *
 * Alternative delivery covers "seller ships it themselves" and digital goods;
 * the manual endpoints close out packages that were delivered or returned
 * outside Trendyol's tracking.
 *
 * @see https://developers.trendyol.com/v2.0/reference/shipping-alternative-delivery
 */
export class DeliveriesResource extends BaseResource {
  /**
   * Ship a package through the seller's own cargo link.
   *
   * @operationId processAlternativeDelivery
   */
  processAlternative(
    packageId: PackageId,
    body: ProcessAlternativeDeliveryBody,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'processAlternativeDelivery',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Deliver a digital product (code, licence, voucher) to the customer.
   *
   * @operationId processAlternativeDeliveryDigital
   */
  processAlternativeDigital(
    packageId: PackageId,
    body: ProcessAlternativeDeliveryDigitalBody,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'processAlternativeDeliveryDigital',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/alternative-delivery-digital',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Mark a package delivered by hand, addressed by package id.
   *
   * @operationId manualDeliverByPackageId
   */
  markDelivered(packageId: PackageId, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'manualDeliverByPackageId',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/manual-invoice-delivery',
      pathParams: { sellerId: this.sellerId, packageId },
      ...this.options(options),
    });
  }

  /**
   * Mark a package delivered by hand, addressed by cargo tracking number.
   *
   * @operationId manualDeliverByTrackingNumber
   */
  markDeliveredByTrackingNumber(
    cargoTrackingNumber: CargoTrackingNumber,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'manualDeliverByTrackingNumber',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/manual-invoice-delivery-by-tracking-number/{cargoTrackingNumber}',
      pathParams: { sellerId: this.sellerId, cargoTrackingNumber },
      ...this.options(options),
    });
  }

  /**
   * Mark a package returned by hand, addressed by package id.
   *
   * @operationId manualReturnByPackageId
   */
  markReturned(packageId: PackageId, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'manualReturnByPackageId',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/manual-return',
      pathParams: { sellerId: this.sellerId, packageId },
      ...this.options(options),
    });
  }

  /**
   * Mark a package returned by hand, addressed by cargo tracking number.
   *
   * @operationId manualReturnByTrackingNumber
   */
  markReturnedByTrackingNumber(
    cargoTrackingNumber: CargoTrackingNumber,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'manualReturnByTrackingNumber',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/manual-return-by-tracking-number/{cargoTrackingNumber}',
      pathParams: { sellerId: this.sellerId, cargoTrackingNumber },
      ...this.options(options),
    });
  }
}
