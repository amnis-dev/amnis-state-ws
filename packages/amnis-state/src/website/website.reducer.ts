import { websiteSlice } from './website.js';

export const reducerMap = {
  [websiteSlice.name]: websiteSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
