import type { Middleware } from '@reduxjs/toolkit';
import { apiSlice } from './api/index.js';
import { apiAuth } from './auth/index.js';
import { apiCrud } from './crud/index.js';

const reducers = {
  [apiSlice.name]: apiSlice.reducer,
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
