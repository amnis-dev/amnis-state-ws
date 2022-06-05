import { apiOutput } from '../api';
import type {
  ApiAuthHandlers,
} from './auth.types';

export function apiAuthHandlersSetup(): ApiAuthHandlers {
  return {
    /**
     * API handler for creating new data in storage.
     */
    authorize: (input) => {
      const output = apiOutput();

      // switch (method) {
      //   case 'msgraph':
      //     // do nothing.
      //     break;

      //   default:
      // }

      return output;
    },
  };
}

export default apiAuthHandlersSetup;
