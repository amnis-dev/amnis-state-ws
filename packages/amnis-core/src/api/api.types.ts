import { DateJSON } from '../common.types';

/**
 * An API error repsonse.
 */
export interface ApiError {
  code: number;
  message: string | null;
}

/**
 * API Request.
 */
export interface ApiRequest {
  /**
   * Ask to renew session.
   */
  renew?: boolean;
}

/**
 * API Response.
 */
export interface ApiResponse {
  /**
   * Possible error details.
   */
  error?: ApiError;

  /**
   * Session expiration date-time.
   */
  expire?: DateJSON;
}
