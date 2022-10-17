import { serviceSlice } from './service.js';

export const reducerMap = {
  [serviceSlice.name]: serviceSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
