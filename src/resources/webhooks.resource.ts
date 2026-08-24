import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  CreateWebhookBody,
  CreateWebhookResponse,
  GetWebhooksResponse,
  UpdateWebhookBody,
} from '../generated/webhook.js';

/**
 * The webhook service is mounted under its own prefix on the gateway; the spec's
 * server URL is `.../integration/webhook`, so paths carry it explicitly here.
 */
const PREFIX = '/webhook';

/** Identifier of a registered webhook. */
export type WebhookId = string | number;

/**
 * Webhook registration — Trendyol pushing order events instead of you polling.
 *
 * A webhook must answer 2xx within the timeout or Trendyol retries and,
 * after repeated failures, deactivates it. Re-enable with {@link activate}.
 *
 * @see https://developers.trendyol.com/v2.0/reference/webhook
 */
export class WebhooksResource extends BaseResource {
  /**
   * Register a new webhook endpoint.
   *
   * @operationId createWebhook
   */
  create(body: CreateWebhookBody, options: RequestOptions = {}): Promise<CreateWebhookResponse> {
    return this.transport.request<CreateWebhookResponse>({
      operationId: 'createWebhook',
      method: 'POST',
      path: `${PREFIX}/sellers/{sellerId}/webhooks`,
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }

  /**
   * List registered webhooks and their current state.
   *
   * @operationId getWebhooks
   */
  list(options: RequestOptions = {}): Promise<GetWebhooksResponse> {
    return this.transport.request<GetWebhooksResponse>({
      operationId: 'getWebhooks',
      method: 'GET',
      path: `${PREFIX}/sellers/{sellerId}/webhooks`,
      pathParams: { sellerId: this.sellerId },
      ...this.options(options),
    });
  }

  /**
   * Replace a webhook's configuration.
   *
   * @operationId updateWebhook
   */
  update(id: WebhookId, body: UpdateWebhookBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'updateWebhook',
      method: 'PUT',
      path: `${PREFIX}/sellers/{sellerId}/webhooks/{Id}`,
      pathParams: { sellerId: this.sellerId, Id: id },
      body,
      ...this.options(options),
    });
  }

  /**
   * Delete a webhook permanently.
   *
   * @operationId deleteWebhook
   */
  delete(id: WebhookId, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'deleteWebhook',
      method: 'DELETE',
      path: `${PREFIX}/sellers/{sellerId}/webhooks/{Id}`,
      pathParams: { sellerId: this.sellerId, Id: id },
      ...this.options(options),
    });
  }

  /**
   * Resume delivery to a webhook.
   *
   * @operationId activateWebhook
   */
  activate(id: WebhookId, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'activateWebhook',
      method: 'PUT',
      path: `${PREFIX}/sellers/{sellerId}/webhooks/{Id}/activate`,
      pathParams: { sellerId: this.sellerId, Id: id },
      ...this.options(options),
    });
  }

  /**
   * Pause delivery to a webhook without deleting it.
   *
   * @operationId deactivateWebhook
   */
  deactivate(id: WebhookId, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'deactivateWebhook',
      method: 'PUT',
      path: `${PREFIX}/sellers/{sellerId}/webhooks/{Id}/deactivate`,
      pathParams: { sellerId: this.sellerId, Id: id },
      ...this.options(options),
    });
  }
}
