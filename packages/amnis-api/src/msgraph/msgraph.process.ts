import { apiOutput } from '../api';
import type {
  ApiMSGraphProcesses,
} from './msgraph.types';

export function apiMSGraphProcesses(): ApiMSGraphProcesses {
  return {
    /**
     * API process for creating new data in storage.
     */
    myendpoint: (input) => {
      const { body } = input;
      const { data } = body;

      const output = apiOutput();

      output.json = {
        ...output.json,
        result: data || {},
      };

      return output;
    },

  };
}

export default apiMSGraphProcesses;
