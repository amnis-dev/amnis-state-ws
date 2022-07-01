import { userSlice } from './user';

export const reducerMap = {
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [];

export default reducerMap;
