import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './user.reducer.js';

export function userStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const userStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });

  return userStore;
}

export default userStoreSetup;
