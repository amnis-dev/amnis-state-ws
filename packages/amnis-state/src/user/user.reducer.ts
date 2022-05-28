import { apiRedux } from '@amnis/api/redux.node';
import { userSlice } from './user';

export const reducerMap = {
  [apiRedux.reducerPath]: apiRedux.reducer,
  [userSlice.name]: userSlice.reducer,
};

export const reducerMiddleware = [
  apiRedux.middleware,
];

export default reducerMap;
