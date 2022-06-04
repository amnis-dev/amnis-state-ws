import type { ApiResponse } from '../types';
import type {
  ApiMSGraphHandlers,
} from './msgraph.types';

export function apiMSGraphHandlersSetup(): ApiMSGraphHandlers {
  return {
    /**
     * API handler for creating new data in storage.
     */
    myendpoint: ({ body }): ApiResponse => {
      const { data } = body;

      return {
        errors: [],
        result: data || {},
      };
    },

  };
}

export default apiMSGraphHandlersSetup;
