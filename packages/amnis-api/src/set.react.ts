import type { Middleware } from '@reduxjs/toolkit';
import { apiAuth } from './auth/index.react.js';
import { apiCrud } from './crud/index.react.js';

const reducers = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
};

const middleware: Middleware[] = [
  apiAuth.middleware,
  apiCrud.middleware,
];

export const apiSet = {
  reducers,
  middleware,
};

export default apiSet;
