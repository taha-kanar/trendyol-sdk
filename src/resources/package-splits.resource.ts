import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type { PackageId } from './orders.resource.js';
import type {
  MultiSplitShipmentPackageBody,
  MultiSplitShipmentPackageResponse,
  SplitMultiPackagesByQuantityBody,
  SplitShipmentPackageBody,
  SplitShipmentPackageByQuantityBody,
  SplitShipmentPackageByQuantityResponse,
  SplitShipmentPackageResponse,
} from '../generated/marketplace.js';

/**
 * Splitting a package when part of it cannot ship together.
 *
 * Four variants exist because Trendyol grew them separately; pick by what you
 * are splitting on — line ids, quantities, or barcodes.
 *
 * @see https://developers.trendyol.com/v2.0/reference/split-order-package
 */
export class PackageSplitsResource extends BaseResource {
  /**
   * Split by line ids: the listed lines move into a new package.
   *
   * @operationId splitShipmentPackage
   */
  byLines(
    packageId: PackageId,
    body: SplitShipmentPackageBody,
    options: RequestOptions = {}
  ): Promise<SplitShipmentPackageResponse> {
    return this.transport.request<SplitShipmentPackageResponse>({
      operationId: 'splitShipmentPackage',
      method: 'POST',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/split',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Split one line by quantity, e.g. ship 2 of 5 now.
   *
   * @operationId splitShipmentPackageByQuantity
   */
  byQuantity(
    packageId: PackageId,
    body: SplitShipmentPackageByQuantityBody,
    options: RequestOptions = {}
  ): Promise<SplitShipmentPackageByQuantityResponse> {
    return this.transport.request<SplitShipmentPackageByQuantityResponse>({
      operationId: 'splitShipmentPackageByQuantity',
      method: 'POST',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/quantity-split',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Split several lines by quantity in one call (multi-barcode packages).
   *
   * @operationId splitMultiPackagesByQuantity
   */
  multiByQuantity(
    packageId: PackageId,
    body: SplitMultiPackagesByQuantityBody,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'splitMultiPackagesByQuantity',
      method: 'POST',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/split-packages',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Explode a package into several packages at once.
   *
   * @operationId multiSplitShipmentPackage
   */
  multi(
    packageId: PackageId,
    body: MultiSplitShipmentPackageBody,
    options: RequestOptions = {}
  ): Promise<MultiSplitShipmentPackageResponse> {
    return this.transport.request<MultiSplitShipmentPackageResponse>({
      operationId: 'multiSplitShipmentPackage',
      method: 'POST',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/multi-split',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }
}
