import { tokenSlice } from './token.js';

export const reducerMap = {
  [tokenSlice.name]: tokenSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
