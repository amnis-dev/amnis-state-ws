import { roleSlice } from './role.js';

export const reducerMap = {
  [roleSlice.name]: roleSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
