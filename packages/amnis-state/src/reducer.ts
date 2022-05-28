import { entityApi } from '@amnis/api/entityApi';
import { userSlice } from './user';

export const reducerMap = {
  [entityApi.reducerPath]: entityApi.reducer,
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [
  entityApi.middleware,
];

export default { reducerMap };
