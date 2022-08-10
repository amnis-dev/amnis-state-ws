---
to: "<%= path ? `${path}/${name}/${name}.reducer.ts` : null %>"
---
import { <%= name %>Slice } from './<%= name %>.js';

export const reducerMap = {
  [<%= name %>Slice.name]: <%= name %>Slice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
