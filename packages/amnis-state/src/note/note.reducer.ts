import { noteSlice } from './note.js';

export const reducerMap = {
  [noteSlice.name]: noteSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
