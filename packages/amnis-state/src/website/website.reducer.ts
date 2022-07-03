import { websiteSlice } from './website';

export const reducerMap = {
  [websiteSlice.name]: websiteSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
