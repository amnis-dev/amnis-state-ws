import { contactSlice } from './contact.js';

export const reducerMap = {
  [contactSlice.name]: contactSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
