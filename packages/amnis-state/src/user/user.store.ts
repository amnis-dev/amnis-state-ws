import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './user.reducer';

export function userStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const userStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return userStore;
}

export default userStoreSetup;
