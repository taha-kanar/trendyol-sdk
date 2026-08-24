import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  CancelOrderPackageItemBody,
  ChangeCargoProviderBody,
  ExtendAgreedDeliveryDateBody,
  GetShipmentPackagesQuery,
  GetShipmentPackagesResponse,
  GetShipmentPackagesStreamQuery,
  GetShipmentPackagesStreamResponse,
  UpdateBoxInfoBody,
  UpdateLaborCostsBody,
  UpdatePackageStatusBody,
  UpdateWarehouseBody,
} from '../generated/marketplace.js';

/** Identifier of a shipment package (`shipmentPackageId`). */
export type PackageId = number | string;

/**
 * Order packages — listing them and moving them through their lifecycle.
 *
 * Trendyol models an order as one or more *shipment packages*; every operation
 * here works on a package, never on the order as a whole.
 *
 * @see https://developers.trendyol.com/v2.0/reference/order-integration
 */
export class OrdersResource extends BaseResource {
  /**
   * List order packages, page by page.
   *
   * `startDate`/`endDate` are Unix timestamps in **milliseconds** and may span
   * at most two weeks. Without them Trendyol returns the last two weeks.
   *
   * @operationId getShipmentPackages
   */
  list(query: GetShipmentPackagesQuery = {}, options: RequestOptions = {}): Promise<GetShipmentPackagesResponse> {
    return this.transport.request<GetShipmentPackagesResponse>({
      operationId: 'getShipmentPackages',
      method: 'GET',
      path: '/order/sellers/{sellerId}/orders',
      pathParams: { sellerId: this.sellerId },
      query: query,
      ...this.options(options),
    });
  }

  /**
   * List order packages with cursor pagination.
   *
   * Preferred over {@link list} for full syncs: the sort order is fixed
   * (`lastModifiedDate` DESC) so packages cannot slip between pages. Pass the
   * previous response's `nextCursor` while `hasMore` is true.
   *
   * @operationId getShipmentPackagesStream
   */
  listStream(
    query: GetShipmentPackagesStreamQuery = {},
    options: RequestOptions = {}
  ): Promise<GetShipmentPackagesStreamResponse> {
    return this.transport.request<GetShipmentPackagesStreamResponse>({
      operationId: 'getShipmentPackagesStream',
      method: 'GET',
      path: '/order/sellers/{sellerId}/orders/stream',
      pathParams: { sellerId: this.sellerId },
      query: query,
      ...this.options(options),
    });
  }

  /**
   * Move a package to `Picking` or `Invoiced`.
   *
   * Only forward transitions are allowed, and `Invoiced` is the point where
   * `params.invoiceNumber` may be supplied.
   *
   * @operationId updatePackageStatus
   */
  updateStatus(packageId: PackageId, body: UpdatePackageStatusBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'updatePackageStatus',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Mark package lines as unsupplied (out of stock), cancelling them.
   *
   * @operationId cancelOrderPackageItem
   */
  cancelItems(packageId: PackageId, body: CancelOrderPackageItemBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'cancelOrderPackageItem',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/items/unsupplied',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Report the package's desi (volumetric weight) and box count.
   *
   * @operationId updateBoxInfo
   */
  updateBoxInfo(packageId: PackageId, body: UpdateBoxInfoBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'updateBoxInfo',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/box-info',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Mark a package as handed over at a collection point / store.
   *
   * @operationId deliveredByService
   */
  deliverByService(packageId: PackageId, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'deliveredByService',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/delivered-by-service',
      pathParams: { sellerId: this.sellerId, packageId },
      ...this.options(options),
    });
  }

  /**
   * Switch the package to a different cargo provider.
   *
   * Allowed only before the package is shipped. Provider codes come from
   * {@link LookupResource.cargoProviders}.
   *
   * @operationId changeCargoProvider
   */
  changeCargoProvider(
    packageId: PackageId,
    body: ChangeCargoProviderBody,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'changeCargoProvider',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/cargo-providers',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Point the package at a different warehouse.
   *
   * @operationId updateWarehouse
   */
  updateWarehouse(packageId: PackageId, body: UpdateWarehouseBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'updateWarehouse',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/warehouse',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Request extra supply time, pushing out the agreed delivery date.
   *
   * Only possible while `agreedDeliveryDateExtendible` is true on the package.
   *
   * @operationId extendAgreedDeliveryDate
   */
  extendAgreedDeliveryDate(
    packageId: PackageId,
    body: ExtendAgreedDeliveryDateBody,
    options: RequestOptions = {}
  ): Promise<void> {
    return this.transport.request<void>({
      operationId: 'extendAgreedDeliveryDate',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/extended-agreed-delivery-date',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Declare assembly / labor cost for packages that require installation.
   *
   * @operationId updateLaborCosts
   */
  updateLaborCosts(packageId: PackageId, body: UpdateLaborCostsBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'updateLaborCosts',
      method: 'PUT',
      path: '/order/sellers/{sellerId}/shipment-packages/{packageId}/labor-costs',
      pathParams: { sellerId: this.sellerId, packageId },
      body,
      ...this.options(options),
    });
  }
}
