import { noteSlice } from './note';

export const reducerMap = {
  [noteSlice.name]: noteSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
