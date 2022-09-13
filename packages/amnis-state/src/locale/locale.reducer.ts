import { localeSlice } from './locale';

export const reducerMap = {
  [localeSlice.name]: localeSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
