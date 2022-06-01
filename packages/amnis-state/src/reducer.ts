import { apiCrud } from '@amnis/api/index';
import { sessionSlice } from './session';
import { userSlice } from './user';

export const reducerMap = {
  [apiCrud.reducerPath]: apiCrud.reducer,
  [userSlice.name]: userSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
};

export const reducerMiddleware = [
  apiCrud.middleware,
];

export default { reducerMap };
