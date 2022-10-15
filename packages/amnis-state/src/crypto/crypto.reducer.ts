import { cryptoSlice } from './crypto.js';

export const reducerMap = {
  [cryptoSlice.name]: cryptoSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
