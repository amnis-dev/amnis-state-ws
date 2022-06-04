---
to: "<%= path ? `${path}/${name}/${name}.handlers.ts` : null %>"
---
import type { ApiResponse } from '../types';
import type {
  Api<%= Name %>Handlers,
} from './<%= name %>.types';

export function api<%= Name %>HandlersSetup(): Api<%= Name %>Handlers {
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

export default api<%= Name %>HandlersSetup;
