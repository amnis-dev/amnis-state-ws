---
to: <%= `${cwd}/${name}/${name}.reducer.ts` %>
---
import { entityApi } from '@amnis/query/entityApi/entityApi.node';
import { userSlice } from './<%= name %>';

export const reducerMap = {
  [entityApi.reducerPath]: entityApi.reducer,
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [
  entityApi.middleware,
];

export default { reducerMap, reducerMiddleware };
