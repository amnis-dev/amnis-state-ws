import { apiCrud } from '@amnis/api/index';
import { userSlice } from './user';
import { roleSlice } from './role';

export const reducerMap = {
  [apiCrud.reducerPath]: apiCrud.reducer,
  [userSlice.name]: userSlice.reducer,
  [roleSlice.name]: roleSlice.reducer,
};

export const reducerMiddleware = [
  apiCrud.middleware,
];

export default { reducerMap };
