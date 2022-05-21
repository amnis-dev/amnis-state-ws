import { entityApi } from '@amnis/query/entityApi/entityApi.node';
import { userSlice } from './user';

export const reducerMap = {
  [entityApi.reducerPath]: entityApi.reducer,
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [
  entityApi.middleware,
];

export default reducerMap;
