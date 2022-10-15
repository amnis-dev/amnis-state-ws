import { auditSlice } from './audit.js';

export const reducerMap = {
  [auditSlice.name]: auditSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
