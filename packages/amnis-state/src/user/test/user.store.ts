import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { entityApi } from '@amnis/query/entityApi/entityApi.node';
import { userSlice } from '../user';
import { userSetSlice } from '../userSet';

export function setupStore() {
  const rootReducer = combineReducers({
    [entityApi.reducerPath]: entityApi.reducer,
    [userSlice.name]: userSlice.reducer,
    [userSetSlice.name]: userSetSlice.reducer,
  });

  const userStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(entityApi.middleware)
    ),
  });
  return userStore;
}

export default setupStore;
