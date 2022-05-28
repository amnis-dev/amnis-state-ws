import { stateApi } from '@amnis/api/stateApi/stateApi.node';
import { userSlice } from './user';

export const reducerMap = {
  [stateApi.reducerPath]: stateApi.reducer,
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [
  stateApi.middleware,
];

export default reducerMap;
