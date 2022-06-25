import { systemSlice } from './system';

export const reducerMap = {
  [systemSlice.name]: systemSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
