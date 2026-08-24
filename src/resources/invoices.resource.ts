import { toFormData } from '../core/http/form-data.js';
import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  DeleteInvoiceLinkBody,
  SendInvoiceLinkBody,
  UploadInvoiceFileBody,
} from '../generated/invoice.js';

/**
 * Customer invoices: sending a link, revoking it, or uploading the file itself.
 *
 * @see https://developers.trendyol.com/v2.0/reference/invoice-link-management
 */
export class InvoicesResource extends BaseResource {
  /**
   * Attach an invoice link to a shipment package.
   *
   * @operationId sendInvoiceLink
   */
  sendLink(body: SendInvoiceLinkBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'sendInvoiceLink',
      method: 'POST',
      path: '/sellers/{sellerId}/seller-invoice-links',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Revoke a previously sent invoice link.
   *
   * Note the verb: Trendyol deletes with `POST .../delete`, not `DELETE`.
   *
   * @operationId deleteInvoiceLink
   */
  deleteLink(body: DeleteInvoiceLinkBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'deleteInvoiceLink',
      method: 'POST',
      path: '/sellers/{sellerId}/seller-invoice-links/delete',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * Upload the invoice document itself (PDF, JPEG or PNG, up to 10 MB).
   *
   * Micro-export orders additionally require `invoiceNumber` and
   * `invoiceDateTime`; for domestic orders both are optional.
   *
   * @operationId uploadInvoiceFile
   */
  uploadFile(body: UploadInvoiceFileBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'uploadInvoiceFile',
      method: 'POST',
      path: '/sellers/{sellerId}/seller-invoice-file',
      pathParams: { sellerId: this.sellerId },
      body: toFormData(body),
      ...this.options(options),
    });
  }
}
