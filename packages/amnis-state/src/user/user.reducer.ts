import { stateApi } from '@amnis/query/stateApi/stateApi.node';
import { userSlice } from './user';

export const reducerMap = {
  [stateApi.reducerPath]: stateApi.reducer,
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [
  stateApi.middleware,
];

export default reducerMap;
