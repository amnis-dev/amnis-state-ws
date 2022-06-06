import { apiOutput } from '../api';
import type {
  ApiAuthProcesses,
} from './auth.types';

export function apiAuthProcesses(): ApiAuthProcesses {
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

export default apiAuthProcesses;
