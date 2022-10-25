---
to: "<%= path ? `${path}/${name}/${name}.queries.ts` : null %>"
---
import type {
  PayloadEntityCreate,
} from '@amnis/core';
import type {
  Api<%= Name %>Queries,
} from './<%= name %>.types.js';

export function api<%= Name %>Queries(): Api<%= Name %>Queries {
  return {
    myendpoint: (payload: PayloadEntityCreate) => ({
      url: 'myendpoint',
      method: 'post',
      body: payload,
    }),
  };
}

export default api<%= Name %>Queries;
