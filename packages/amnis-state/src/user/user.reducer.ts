import { userSlice } from './user.js';

export const reducerMap = {
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [];

export default reducerMap;
