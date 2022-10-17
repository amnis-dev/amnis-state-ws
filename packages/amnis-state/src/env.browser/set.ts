import { apiAuth } from '@amnis/api/auth/auth.api.browser.js';
import { apiCrud } from '@amnis/api/crud/crud.api.browser.js';

import baseSet from '../set.js';

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
