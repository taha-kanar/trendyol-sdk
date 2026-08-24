import type { HttpClient, HttpRequest, HttpResponse } from '../../src/index.js';

export interface RecordedCall {
  request: HttpRequest;
  url: URL;
}

/**
 * Test double for {@link HttpClient}.
 *
 * Records every request and replays queued responses, so resource and transport
 * behaviour can be asserted without a network or a running server.
 */
export class MockHttpClient implements HttpClient {
  readonly calls: RecordedCall[] = [];
  private readonly queue: Array<Partial<HttpResponse> | Error> = [];

  /** Queue the next response. Defaults to `200 {}`. */
  enqueue(response: Partial<HttpResponse> | Error): this {
    this.queue.push(response);
    return this;
  }

  /** Queue a JSON body with an optional status. */
  enqueueJson(body: unknown, status = 200): this {
    return this.enqueue({
      status,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    });
  }

  get lastCall(): RecordedCall {
    const call = this.calls.at(-1);
    if (!call) throw new Error('MockHttpClient: no request was made');
    return call;
  }

  async send(request: HttpRequest): Promise<HttpResponse> {
    this.calls.push({ request, url: new URL(request.url) });

    const next = this.queue.shift();
    if (next instanceof Error) throw next;

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: '{}',
      ...next,
    };
  }
}
