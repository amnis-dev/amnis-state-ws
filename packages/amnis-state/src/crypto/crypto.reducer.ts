import { cryptoSlice } from './crypto';

export const reducerMap = {
  [cryptoSlice.name]: cryptoSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
