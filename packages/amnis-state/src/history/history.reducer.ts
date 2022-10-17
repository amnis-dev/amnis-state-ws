import { historySlice } from './history.js';

export const reducerMap = {
  [historySlice.name]: historySlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
