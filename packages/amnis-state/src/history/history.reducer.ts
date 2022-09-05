import { historySlice } from './history';

export const reducerMap = {
  [historySlice.name]: historySlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
