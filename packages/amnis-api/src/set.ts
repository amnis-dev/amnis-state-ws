import type { Middleware } from '@reduxjs/toolkit';
import { apiAuth } from './auth/index.js';
import { apiCrud } from './crud/index.js';

const reducers = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
};

const middleware: Middleware[] = [
  apiAuth.middleware,
  apiCrud.middleware,
];

export const set = {
  reducers,
  middleware,
};

export default set;
