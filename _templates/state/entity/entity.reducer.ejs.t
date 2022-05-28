---
to: "<%= path ? `${path}/${name}/${name}.reducer.ts` : null %>"
---
import { entityApi } from '@amnis/api/entityApi/entityApi.node';
import { <%= name %>Slice } from './<%= name %>';

export const reducerMap = {
  [entityApi.reducerPath]: entityApi.reducer,
  [<%= name %>Slice.name]: <%= name %>Slice.reducer,
};

export const reducerMiddleware = [
  entityApi.middleware,
];

export default { reducerMap, reducerMiddleware };
