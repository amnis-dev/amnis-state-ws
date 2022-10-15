import { localeSlice } from './locale.js';

export const reducerMap = {
  [localeSlice.name]: localeSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
