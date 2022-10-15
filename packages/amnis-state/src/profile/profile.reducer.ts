import { profileSlice } from './profile.js';

export const reducerMap = {
  [profileSlice.name]: profileSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap, reducerMiddleware };
