/* eslint-disable */
/**
 * Invoice Integration
 * API for Trendyol Seller Invoice Integration - e-Invoice and e-Archive invoice management integration services
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/invoice.json · regenerate with `npm run generate`.
 */

import type { FileInput } from '../core/http/form-data.js';

export interface InvoiceLinkRequest {
  /**
   * e-Invoice or e-Archive invoice link. This link must be accessible for 8 years (legal requirement).
   * @format uri
   * @example "https://extfatura.faturaentegratoru.com/324523-34523-52345-3453245.pdf"
   */
  invoiceLink: string;
  /**
   * Trendyol order package ID
   * @format int64
   * @example 435346
   */
  shipmentPackageId: number;
  /**
   * Invoice date - Unix timestamp format (seconds or milliseconds).
   * Should be greater than 0, 10 digits (seconds) or 13 digits (milliseconds).
   * Required for micro export packages, optional for other package types.
   * @format int64
   * @example 1678788898
   */
  invoiceDateTime?: number;
  /**
   * Invoice number. Required for micro export packages, optional for other package types.
   * 
   * Format Rules:
   * - First 3 characters: alphanumeric (letter or number)
   * - Last 13 characters: numeric
   * 
   * Total 16 characters: [3 alphanumeric][13 numeric]
   * @example "TY41234567890123"
   */
  invoiceNumber?: string;
}

export interface InvoiceLinkDeleteRequest {
  /**
   * Order package ID (shipmentPackageId)
   * @format int64
   * @example 88787
   */
  serviceSourceId: number;
  /**
   * Channel ID - Should always be sent as 1
   * @default 1
   * @example 1
   */
  channelId: 1;
  /**
   * Customer ID - Can be obtained from get order packages service
   * @format int64
   * @example 167878
   */
  customerId: number;
}

/** Request body for `POST /sellers/{sellerId}/seller-invoice-links`. */
export type SendInvoiceLinkBody = InvoiceLinkRequest;

/** `POST /sellers/{sellerId}/seller-invoice-links` returns no response body. */
export type SendInvoiceLinkResponse = void;

/** Request body for `POST /sellers/{sellerId}/seller-invoice-links/delete`. */
export type DeleteInvoiceLinkBody = InvoiceLinkDeleteRequest;

/** `POST /sellers/{sellerId}/seller-invoice-links/delete` returns no response body. */
export type DeleteInvoiceLinkResponse = void;

/** Request body for `POST /sellers/{sellerId}/seller-invoice-file`. */
export interface UploadInvoiceFileBody {
  /**
   * Order package ID (required)
   * @format int64
   */
  shipmentPackageId: number;
  /**
   * Invoice date - Unix timestamp format, greater than 0, 10 digits (seconds) or 13 digits (milliseconds).
   * Required for micro export orders, optional for others.
   * @format int64
   */
  invoiceDateTime?: number;
  /**
   * Invoice number - Required for micro export orders, optional for others.
   * Format rules: First 3 characters alphanumeric, last 13 characters numeric (total 16).
   */
  invoiceNumber?: string;
  /**
   * Invoice file (PDF, JPEG, or PNG format, maximum 10 MB)
   * @format binary
   */
  file: FileInput;
}

/** `POST /sellers/{sellerId}/seller-invoice-file` returns no response body. */
export type UploadInvoiceFileResponse = void;

