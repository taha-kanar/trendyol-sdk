import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  AnswerQuestionBody,
  CreateQuestionBody,
  CreateQuestionResponse,
  GetQuestionFilterQuery,
  GetQuestionFilterResponse,
  GetQuestionResponse,
} from '../generated/question.js';

/**
 * Customer questions on product pages.
 *
 * Answers go through moderation, so a successful call means "submitted", not
 * "published".
 *
 * @see https://developers.trendyol.com/v2.0/reference/customer-question-integration
 */
export class QuestionsResource extends BaseResource {
  /**
   * List questions, filtered by status and date range.
   *
   * @operationId getQuestionFilter
   */
  list(query: GetQuestionFilterQuery = {}, options: RequestOptions = {}): Promise<GetQuestionFilterResponse> {
    return this.transport.request<GetQuestionFilterResponse>({
      operationId: 'getQuestionFilter',
      method: 'GET',
      path: '/qna/sellers/{sellerId}/questions/filter',
      pathParams: { sellerId: this.sellerId },
      query,
      ...this.options(options),
    });
  }

  /**
   * A single question with its answer history.
   *
   * @operationId getQuestion
   */
  get(id: number | string, options: RequestOptions = {}): Promise<GetQuestionResponse> {
    return this.transport.request<GetQuestionResponse>({
      operationId: 'getQuestion',
      method: 'GET',
      path: '/qna/sellers/{sellerId}/questions/{id}',
      pathParams: { sellerId: this.sellerId, id },
      ...this.options(options),
    });
  }

  /**
   * Answer a customer's question.
   *
   * @operationId answerQuestion
   */
  answer(id: number | string, body: AnswerQuestionBody, options: RequestOptions = {}): Promise<void> {
    return this.transport.request<void>({
      operationId: 'answerQuestion',
      method: 'POST',
      path: '/qna/sellers/{sellerId}/questions/{id}/answers',
      pathParams: { sellerId: this.sellerId, id },
      body,
      ...this.options(options),
    });
  }

  /**
   * Create a question — used by sellers seeding their own product Q&A.
   *
   * @operationId createQuestion
   */
  create(body: CreateQuestionBody, options: RequestOptions = {}): Promise<CreateQuestionResponse> {
    return this.transport.request<CreateQuestionResponse>({
      operationId: 'createQuestion',
      method: 'POST',
      path: '/qna/sellers/{sellerId}/questions',
      pathParams: { sellerId: this.sellerId },
      body,
      ...this.options(options),
    });
  }
}
