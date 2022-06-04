import type { ApiResponse } from '../types';
import type {
  ApiAuthHandlers,
} from './auth.types';

export function apiAuthHandlersSetup(): ApiAuthHandlers {
  return {
    /**
     * API handler for creating new data in storage.
     */
    authorize: ({ body }): ApiResponse => {
      const { method } = body;

      switch (method) {
        case 'msgraph':
          // do nothing.
          break;

        default:
      }

      return {
        errors: [],
        result: {},
      };
    },
  };
}

export default apiAuthHandlersSetup;
