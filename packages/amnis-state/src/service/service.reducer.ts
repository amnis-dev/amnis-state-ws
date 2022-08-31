import { serviceSlice } from './service';

export const reducerMap = {
  [serviceSlice.name]: serviceSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
