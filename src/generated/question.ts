/* eslint-disable */
/**
 * Trendyol Marketplace - Customer Question Integration
 * API service for managing customer questions asked to sellers on Trendyol.  With this service, you can filter questions, view details, and answer them. 
 *
 * GENERATED FILE — do not edit by hand.
 * Source: openapi/question.json · regenerate with `npm run generate`.
 */

export interface Question {
  /**
   * Unique identifier of the question.
   * @format int64
   */
  id?: number;
  /** Question text asked by the customer. */
  text?: string;
  /**
   * ID of the customer who asked the question.
   * @format int64
   */
  customerId?: number;
  /** Masked name and surname of the customer. */
  userName?: string;
  /** Information on whether the username will be displayed. */
  showUserName?: boolean;
  /** Status of the question. */
  status?: "WAITING_FOR_ANSWER" | "ANSWERED" | "REJECTED" | "REPORTED";
  /** Whether the question is visible to everyone. */
  public?: boolean;
  /** Main group ID of the product the question was asked for. */
  productMainId?: string;
  /** Name of the product the question was asked for. */
  productName?: string;
  /** Product image URL. */
  imageUrl?: string;
  /** Product page link on Trendyol. */
  webUrl?: string;
  /**
   * Question creation date (Epoch ms).
   * @format int64
   */
  creationDate?: number;
  /** User-friendly text of the answer date. (Ex:\ "Your answer was published on 12.02.2026.") */
  answeredDateMessage?: string;
  answer?: Answer;
  rejectedAnswer?: Answer;
  /**
   * Rejection date if the question was rejected.
   * @format int64
   */
  rejectedDate?: number;
  /** Reason for rejection or processing. */
  reason?: string;
  /** Reason for reporting, if reported. */
  reportReason?: string;
  /** @format int64 */
  reportedDate?: number;
}

export interface Answer {
  /** Content of the given answer. */
  text?: string;
  /**
   * Answer creation date.
   * @format int64
   */
  creationDate?: number;
  status?: string;
  /**
   * @format int64
   * @remarks Returned by the API but absent from Trendyol's published spec (observed 2026-08-24).
   */
  id?: number;
}

export interface QuestionAnswerRequest {
  /**
   * Answer text to be provided.
   * - Minimum: 10 characters
   * - Maximum: 2000 characters
   * @example "Dear customer, our product is 100% cotton."
   */
  text: string;
}

export interface QuestionCreateRequest {
  /** Text of the question to be created. */
  text: string;
  /**
   * Content ID of the product the question will be asked for.
   * @format int64
   */
  contentId: number;
  /**
   * ID of the user asking the question.
   * @format int64
   */
  userId: number;
  /** Full name of the user asking the question. */
  userFullName?: string;
  /** Information on whether the username will be displayed. */
  showUserName: boolean;
  /**
   * Channel ID.
   * @format int64
   * @example 1
   */
  channelId?: number;
}

export interface CreateQuestionResponse {
  /**
   * Unique identifier of the created question.
   * @format int64
   */
  questionId?: number;
}

export interface Questions {
  content?: Question[];
  /** Current page number. */
  page?: number;
  /** Number of records per page. */
  size?: number;
  /**
   * Total number of questions.
   * @format int64
   */
  totalElements?: number;
  /** Total number of pages. */
  totalPages?: number;
}

/** Query parameters for `GET /qna/sellers/{sellerId}/questions/filter`. */
export type GetQuestionFilterQuery = {
  /** Product barcode to retrieve questions belonging to a specific product. */
  barcode?: string;
  /**
   * Start date for filtering. (Ex: 1767214800000 - Epoch in milliseconds)
   * @format int64
   */
  startDate?: number;
  /**
   * End date for filtering. (Ex: 1767214800000 - Epoch in milliseconds)
   * @format int64
   */
  endDate?: number;
  /** Current status of the question. */
  status?: "WAITING_FOR_ANSWER" | "ANSWERED" | "REJECTED" | "REPORTED";
  /**
   * Field name to sort by.
   * @default "CreatedDate"
   */
  orderByField?: "CreatedDate" | "LastModifiedDate";
  /**
   * Sorting direction.
   * @default "DESC"
   */
  orderByDirection?: "ASC" | "DESC";
  /**
   * Page number to be retrieved (starts from 0).
   * @format int32
   * @default 0
   */
  page?: number;
  /**
   * Number of questions to list per page.
   * @format int32
   * @default 10
   * @maximum 200
   */
  size?: number;
};

/** Response of `GET /qna/sellers/{sellerId}/questions/filter`. */
export type GetQuestionFilterResponse = Questions;

/** Request body for `POST /qna/sellers/{sellerId}/questions`. */
export type CreateQuestionBody = QuestionCreateRequest;

/** Response of `GET /qna/sellers/{sellerId}/questions/{id}`. */
export type GetQuestionResponse = Question;

/** Request body for `POST /qna/sellers/{sellerId}/questions/{id}/answers`. */
export type AnswerQuestionBody = QuestionAnswerRequest;

/**
 * Response of `POST /qna/sellers/{sellerId}/questions/{id}/answers`.
 * @example "Your answer has been successfully saved."
 */
export type AnswerQuestionResponse = string;

