import { roleSlice } from './role';

export const reducerMap = {
  [roleSlice.name]: roleSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
