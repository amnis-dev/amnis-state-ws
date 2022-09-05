import { auditSlice } from './audit';

export const reducerMap = {
  [auditSlice.name]: auditSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
