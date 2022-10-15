import { sessionSlice } from './session.js';

export const reducerMap = {
  [sessionSlice.name]: sessionSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
