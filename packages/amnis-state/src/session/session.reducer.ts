import { sessionSlice } from './session';

export const reducerMap = {
  [sessionSlice.name]: sessionSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
