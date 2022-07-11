import { apiAuth } from '@amnis/api/auth/auth.api.react';
import { apiCrud } from '@amnis/api/crud/crud.api.react';

import * as base from '../reducer';

export const reducerMap = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
  ...base.reducerMap,
};

export const reducerMiddleware = [
  apiAuth.middleware,
  apiCrud.middleware,
  ...base.reducerMiddleware,
];
