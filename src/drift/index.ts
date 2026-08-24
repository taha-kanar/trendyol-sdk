/**
 * `trendyol-sdk/drift` — tools for catching the API drifting away from its spec.
 *
 * Kept out of the main entry point: {@link loadSpecDocuments} reads from disk,
 * which has no place in a browser bundle.
 */
export {
  findResponseSchema,
  findSchemaDrift,
  type CompareOptions,
  type DriftFinding,
  type DriftKind,
  type JsonSchema,
  type OperationObject,
  type ResponseSchemaLocation,
  type SchemaDocument,
} from './compare.js';
export { loadSpecDocuments } from './spec-documents.js';
export { createDriftMiddleware, type DriftMiddlewareOptions, type DriftReport } from './middleware.js';
