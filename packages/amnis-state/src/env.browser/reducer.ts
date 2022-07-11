import { apiAuth } from '@amnis/api/auth/auth.api.browser';
import { apiCrud } from '@amnis/api/crud/crud.api.browser';

import * as base from '../reducer';

export const reducerMap = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
  ...base.reducerMap,
};

console.log({ base });

export const reducerMiddleware = [
  apiAuth.middleware,
  apiCrud.middleware,
  ...base.reducerMiddleware,
];
