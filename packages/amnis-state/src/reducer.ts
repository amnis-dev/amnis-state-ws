import { apiAuth, apiCrud } from '@amnis/api/index';
import { userSlice } from './user';
import { sessionSlice } from './session';
import { roleSlice } from './role';

export const reducerMap = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
  [userSlice.name]: userSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
  [roleSlice.name]: roleSlice.reducer,
};

export const reducerMiddleware = [
  apiAuth.middleware,
  apiCrud.middleware,
];

export default { reducerMap };
