import { apiAuth } from '@amnis/api/auth/auth.api.react';
import { apiCrud } from '@amnis/api/crud/crud.api.react';

import {
  reducerMap as baseReducerMap,
  reducerMiddleware as baseReducerMiddleware,
} from '../reducer';

export const reducerMap = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
  ...baseReducerMap,
};

export const reducerMiddleware = [
  apiAuth.middleware,
  apiCrud.middleware,
  ...baseReducerMiddleware,
];

export default { reducerMap };
