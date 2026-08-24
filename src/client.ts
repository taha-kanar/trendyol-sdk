import { BasicAuthenticator, type Authenticator } from './core/auth/index.js';
import { FetchHttpClient, type HttpClient } from './core/http/index.js';
import { LoggingMiddleware, type Middleware } from './core/middleware/index.js';
import { silentLogger, type Logger } from './core/logger.js';
import { Transport, type OperationRequest } from './core/transport.js';
import { resolveConfig, type ClientOptions, type ResolvedConfig } from './config.js';
import {
  AddressesResource,
  BatchRequestsResource,
  BrandsResource,
  CategoriesResource,
  ClaimsResource,
  CommonLabelsResource,
  DeliveriesResource,
  ExpressResource,
  FinanceResource,
  InventoryResource,
  InvoicesResource,
  LookupResource,
  OrdersResource,
  PackageSplitsResource,
  ProductUpdatesResource,
  ProductsResource,
  QuestionsResource,
  SupplierAddressesResource,
  TestOrdersResource,
  WebhooksResource,
} from './resources/index.js';

/**
 * Entry point of the SDK.
 *
 * ```ts
 * const trendyol = new TrendyolClient({
 *   sellerId: 123456,
 *   apiKey: process.env.TRENDYOL_API_KEY!,
 *   apiSecret: process.env.TRENDYOL_API_SECRET!,
 *   integrator: 'AcmeCommerce',
 * });
 *
 * const page = await trendyol.orders.list({ status: 'Created', size: 50 });
 * ```
 *
 * The client is a thin composition root: it validates configuration, wires the
 * transport, and hands the same transport to every resource. Resources are
 * created lazily, so importing the client does not construct twenty objects you
 * will never call.
 */
export class TrendyolClient {
  /** Effective configuration after defaults were applied. */
  readonly config: ResolvedConfig;

  private readonly transport: Transport;
  private readonly cache = new Map<string, unknown>();

  constructor(options: ClientOptions) {
    const logger: Logger = options.logger ?? silentLogger;
    this.config = resolveConfig(options, logger);

    const authenticator: Authenticator =
      options.authenticator ?? new BasicAuthenticator(options.apiKey as string, options.apiSecret as string);

    const httpClient: HttpClient =
      options.httpClient ??
      new FetchHttpClient({
        ...(options.fetch ? { fetch: options.fetch } : {}),
        ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
      });

    const middleware: Middleware[] = [
      ...(options.logger ? [new LoggingMiddleware(logger)] : []),
      ...(options.middleware ?? []),
    ];

    this.transport = new Transport({
      baseUrl: this.config.baseUrl,
      httpClient,
      authenticator,
      middleware,
      defaultHeaders: this.config.defaultHeaders,
      arrayFormat: this.config.arrayFormat,
      userAgent: this.config.userAgent,
    });
  }

  /** Order packages: listing, status transitions, cargo and warehouse changes. */
  get orders(): OrdersResource {
    return this.resource('orders', OrdersResource);
  }

  /** Splitting a package into several shipments. */
  get packageSplits(): PackageSplitsResource {
    return this.resource('packageSplits', PackageSplitsResource);
  }

  /** Alternative and manual delivery / return flows. */
  get deliveries(): DeliveriesResource {
    return this.resource('deliveries', DeliveriesResource);
  }

  /** Returns (claims): listing, approving, objecting. */
  get claims(): ClaimsResource {
    return this.resource('claims', ClaimsResource);
  }

  /** Country, city, district and neighbourhood reference data. */
  get addresses(): AddressesResource {
    return this.resource('addresses', AddressesResource);
  }

  /** The seller's own warehouse and invoice addresses. */
  get supplierAddresses(): SupplierAddressesResource {
    return this.resource('supplierAddresses', SupplierAddressesResource);
  }

  /** Product catalogue: create, filter, delete, archive, buybox. */
  get products(): ProductsResource {
    return this.resource('products', ProductsResource);
  }

  /** Bulk edits to existing listings, and their audit trail. */
  get productUpdates(): ProductUpdatesResource {
    return this.resource('productUpdates', ProductUpdatesResource);
  }

  /** Category tree and per-category attributes. */
  get categories(): CategoriesResource {
    return this.resource('categories', CategoriesResource);
  }

  /** Brand listing, search and creation requests. */
  get brands(): BrandsResource {
    return this.resource('brands', BrandsResource);
  }

  /** Price and stock updates. */
  get inventory(): InventoryResource {
    return this.resource('inventory', InventoryResource);
  }

  /** Results of asynchronous catalogue writes. */
  get batchRequests(): BatchRequestsResource {
    return this.resource('batchRequests', BatchRequestsResource);
  }

  /** Shared reference data, e.g. cargo providers. */
  get lookup(): LookupResource {
    return this.resource('lookup', LookupResource);
  }

  /** Customer questions and answers. */
  get questions(): QuestionsResource {
    return this.resource('questions', QuestionsResource);
  }

  /** Webhook registration and lifecycle. */
  get webhooks(): WebhooksResource {
    return this.resource('webhooks', WebhooksResource);
  }

  /** Customer invoice links and invoice file uploads. */
  get invoices(): InvoicesResource {
    return this.resource('invoices', InvoicesResource);
  }

  /** Settlements, other financials and cargo invoices. */
  get finance(): FinanceResource {
    return this.resource('finance', FinanceResource);
  }

  /** Common label barcodes. */
  get commonLabels(): CommonLabelsResource {
    return this.resource('commonLabels', CommonLabelsResource);
  }

  /** Trendyol Express compensation tickets. */
  get express(): ExpressResource {
    return this.resource('express', ExpressResource);
  }

  /** Test order helpers. Stage environment only. */
  get testOrders(): TestOrdersResource {
    return this.resource('testOrders', TestOrdersResource);
  }

  /**
   * Call an endpoint this SDK does not cover yet.
   *
   * Trendyol ships endpoints faster than any SDK tracks them. Rather than
   * forcing a fork or a version bump, this exposes the same authenticated,
   * middleware-wrapped pipeline the generated resources use:
   *
   * ```ts
   * const result = await trendyol.request<{ id: number }>({
   *   operationId: 'someNewEndpoint',
   *   method: 'POST',
   *   path: '/order/sellers/{sellerId}/brand-new-thing',
   *   pathParams: { sellerId: trendyol.config.sellerId },
   *   body: { hello: 'world' },
   * });
   * ```
   */
  request<TResponse>(operation: OperationRequest): Promise<TResponse> {
    return this.transport.request<TResponse>(operation);
  }

  /** Instantiate a resource once and reuse it. */
  private resource<TResource>(
    key: string,
    Ctor: new (transport: Transport, sellerId: string) => TResource
  ): TResource {
    let instance = this.cache.get(key) as TResource | undefined;
    if (!instance) {
      instance = new Ctor(this.transport, this.config.sellerId);
      this.cache.set(key, instance);
    }
    return instance;
  }
}
