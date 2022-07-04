import { contactSlice } from './contact';

export const reducerMap = {
  [contactSlice.name]: contactSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
