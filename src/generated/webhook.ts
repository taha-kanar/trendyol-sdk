/* eslint-disable */
/**
 * Trendyol Webhook API
 * Webhook management for order packages
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/webhook.json · regenerate with `npm run generate`.
 */

/** Response of `GET /sellers/{sellerId}/webhooks`. */
export type GetWebhooksResponse = {
  /** Webhook ID */
  id?: string;
  /**
   * Date when the webhook request was created (timestamp GMT +3)
   * @format int64
   */
  createdDate?: number;
  /**
   * Date when the webhook request was last updated (timestamp GMT +3)
   * @format int64
   */
  lastModifiedDate?: number | null;
  /** Webhook Service URL */
  url?: string;
  /** Username for Basic Authentication */
  username?: string;
  /** Can be BASIC_AUTHENTICATION or API_KEY */
  authenticationType?: string;
  /** Can be ACTIVE or PASSIVE */
  status?: string;
  /** List of statuses for which order information is requested */
  subscribedStatuses?: string[] | null;
}[];

/** Request body for `POST /sellers/{sellerId}/webhooks`. */
export interface CreateWebhookBody {
  /** Webhook Service URL */
  url: string;
  /** Username for Basic Authentication */
  username?: string;
  /** Password for Basic Authentication */
  password?: string;
  /** Can be BASIC_AUTHENTICATION or API_KEY */
  authenticationType: "BASIC_AUTHENTICATION" | "API_KEY";
  /** API Key for authorization */
  apiKey?: string;
  /**
   * List of statuses for which order information is requested.
   * 
   * If sent empty, all statuses are automatically assigned:
   * - CREATED
   * - PICKING
   * - INVOICED
   * - SHIPPED
   * - CANCELLED
   * - DELIVERED
   * - UNDELIVERED
   * - RETURNED
   * - UNSUPPLIED
   * - AWAITING
   * - UNPACKED
   * - AT_COLLECTION_POINT
   * - VERIFIED
   */
  subscribedStatuses?: Array<"CREATED" | "PICKING" | "INVOICED" | "SHIPPED" | "CANCELLED" | "DELIVERED" | "UNDELIVERED" | "RETURNED" | "UNSUPPLIED" | "AWAITING" | "UNPACKED" | "AT_COLLECTION_POINT" | "VERIFIED">;
}

/** Response of `POST /sellers/{sellerId}/webhooks`. */
export interface CreateWebhookResponse {
  /** Webhook ID */
  id?: string;
}

/** Request body for `PUT /sellers/{sellerId}/webhooks/{Id}`. */
export interface UpdateWebhookBody {
  /** Webhook Service URL */
  url: string;
  /** Username for Basic Authentication */
  username?: string;
  /** Password for Basic Authentication */
  password?: string;
  /** Can be BASIC_AUTHENTICATION or API_KEY */
  authenticationType: "BASIC_AUTHENTICATION" | "API_KEY";
  /** API Key for authorization */
  apiKey?: string;
  /** List of statuses for which order information is requested */
  subscribedStatuses?: Array<"CREATED" | "PICKING" | "INVOICED" | "SHIPPED" | "CANCELLED" | "DELIVERED" | "UNDELIVERED" | "RETURNED" | "UNSUPPLIED" | "AWAITING" | "UNPACKED" | "AT_COLLECTION_POINT" | "VERIFIED">;
}

/**
 * Response of `PUT /sellers/{sellerId}/webhooks/{Id}`.
 * @example "200 OK"
 */
export type UpdateWebhookResponse = string;

/**
 * Response of `DELETE /sellers/{sellerId}/webhooks/{Id}`.
 * @example "200 OK"
 */
export type DeleteWebhookResponse = string;

/**
 * Response of `PUT /sellers/{sellerId}/webhooks/{Id}/activate`.
 * @example "200 OK"
 */
export type ActivateWebhookResponse = string;

/**
 * Response of `PUT /sellers/{sellerId}/webhooks/{Id}/deactivate`.
 * @example "200 OK"
 */
export type DeactivateWebhookResponse = string;

