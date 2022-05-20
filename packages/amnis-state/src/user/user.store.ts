import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { entityApi } from '@amnis/query/entityApi/entityApi.node';
import { userSlice } from './user';

export const reducerMap = {
  [entityApi.reducerPath]: entityApi.reducer,
  [userSlice.name]: userSlice.reducer,
};

export function setupStore() {
  const rootReducer = combineReducers(reducerMap);

  const userStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(entityApi.middleware)
    ),
  });
  return userStore;
}

export default setupStore;
