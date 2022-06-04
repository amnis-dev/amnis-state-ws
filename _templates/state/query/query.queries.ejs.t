---
to: "<%= path ? `${path}/${name}/${name}.queries.ts` : null %>"
---
import type {
  PayloadEntityCreate,
} from '@amnis/core/actions';
import type {
  Api<%= Name %>Queries,
} from './<%= name %>.types';

export function api<%= Name %>QueriesSetup(): Api<%= Name %>Queries {
  return {
    myendpoint: (payload: PayloadEntityCreate) => ({
      url: 'myendpoint',
      method: 'post',
      body: payload,
    }),
  };
}

export default api<%= Name %>QueriesSetup;
