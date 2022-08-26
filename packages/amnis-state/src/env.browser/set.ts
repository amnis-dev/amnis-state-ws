import { apiAuth } from '@amnis/api/auth/auth.api.browser';
import { apiCrud } from '@amnis/api/crud/crud.api.browser';

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
