/**
 * Api type
 */
export interface Api {
  /**
   * ID of this API. Should be the reducerPath on the redux state.
   */
  id: string;

  /**
   * Base URL for the api.
   */
  baseUrl: string;

  /**
   * Bearer token to find for this api.
   */
  bearerId?: string;

  /**
   * Endpoints that require a signature header.
   * A value of `true` indicates all endpoints.
   */
  signature?: string[] | boolean;

  /**
   * Endpoints that require a challenge header.
   * A value of `true` indicates all endpoints.
   */
  challenge?: boolean | string[];

  /**
   * Endpoint that require an OTP header.
   * A value of `true` indicates all endpoints.
   */
  otp?: boolean | string[];
}
