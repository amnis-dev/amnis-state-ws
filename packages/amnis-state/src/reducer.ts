import { apiAuth, apiCrud } from '@amnis/api/index';
import { roleSlice } from './role';
import { sessionSlice } from './session';
import { userSlice } from './user';
import { profileSlice } from './profile';

export const reducerMap = {
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCrud.reducerPath]: apiCrud.reducer,
  [roleSlice.name]: roleSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
};

export const reducerMiddleware = [
  apiAuth.middleware,
  apiCrud.middleware,
];

export default { reducerMap };
