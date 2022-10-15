import { systemSlice } from './system.js';

export const reducerMap = {
  [systemSlice.name]: systemSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
