import { apiAuth } from '@amnis/api/auth/auth.api.node';
import { apiCrud } from '@amnis/api/crud/crud.api.node';

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
