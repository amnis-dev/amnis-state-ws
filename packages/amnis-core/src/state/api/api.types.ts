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
   * Endpoints that require signing.
   * A value of `true` indicates all endpoints.
   */
  sign?: string[] | boolean;

  /**
   * Endpoints that require a challenge value.
   * A value of `true` indicates all endpoints.
   */
  challenge?: boolean | string[];

  /**
   * URL to fetch challenges from.
   */
  challengeUrl?: string;

}
