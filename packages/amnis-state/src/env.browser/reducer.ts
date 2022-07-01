import { apiAuth } from '@amnis/api/auth/auth.api.browser';
import { apiCrud } from '@amnis/api/crud/crud.api.browser';

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
