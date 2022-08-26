import { apiAuth } from '@amnis/api/auth/auth.api.react';
import { apiCrud } from '@amnis/api/crud/crud.api.react';

import baseSet from '../set';

const reducers = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
  ...baseSet.reducers,
};

const middleware = [
  apiAuth.middleware,
  apiCrud.middleware,
  ...baseSet.middleware,
];

export const set = {
  reducers,
  middleware,
};

export default set;
