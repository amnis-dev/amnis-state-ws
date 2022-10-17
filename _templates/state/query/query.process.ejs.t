---
to: "<%= path ? `${path}/${name}/${name}.process.ts` : null %>"
---
import type {
  Api<%= Name %>Processes,
} from './<%= name %>.types.js';
import { apiOutput } from '../api.js';

export function api<%= Name %>Processes(): Api<%= Name %>Processes {
  return {
     /**
     * API processing for the endpoint.
     */
    myendpoint: (input) => {
      const { body } = input;

      const output = apiOutput();

      output.json = {
        ...output.json,
        result: body,
      };

      return output;
    },

  };
}

export default api<%= Name %>Processes;
