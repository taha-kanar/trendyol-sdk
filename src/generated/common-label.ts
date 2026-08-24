/* eslint-disable */
/**
 * Trendyol Marketplace Integration - Common Label Barcode Integration
 * Trendyol Common Label Barcode Integration API
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/common-label.json · regenerate with `npm run generate`.
 */

export interface CommonLabelResponse {
  /** Array of barcode labels */
  data?: {
    /**
     * Barcode label in ZPL format
     * @example "^XA.......^XZ"
     */
    label?: string;
    /**
     * Barcode format
     * @example "ZPL"
     */
    format?: "ZPL";
  }[];
}

/** Response of `GET /sellers/{sellerId}/common-label/{cargoTrackingNumber}`. */
export type GetCommonLabelResponse = CommonLabelResponse;

/** Request body for `POST /sellers/{sellerId}/common-label/{cargoTrackingNumber}`. */
export interface CreateCommonLabelBody {
  /** Barcode format type */
  format: "ZPL";
  /**
   * Box quantity
   * @format int64
   */
  boxQuantity?: number;
  /**
   * Volumetric height
   * @format float
   */
  volumetricHeight?: number;
}

/** `POST /sellers/{sellerId}/common-label/{cargoTrackingNumber}` returns no response body. */
export type CreateCommonLabelResponse = void;

