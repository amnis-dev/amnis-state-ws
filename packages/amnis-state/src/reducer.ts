import { apiCrud } from '@amnis/api/index';
import { userSlice } from './user';

export const reducerMap = {
  [apiCrud.reducerPath]: apiCrud.reducer,
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [
  apiCrud.middleware,
];

export default { reducerMap };
