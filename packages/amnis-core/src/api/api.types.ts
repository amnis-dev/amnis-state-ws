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
}
