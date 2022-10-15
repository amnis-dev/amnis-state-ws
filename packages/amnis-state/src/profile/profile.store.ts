import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './profile.reducer.js';

export function profileStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const profileStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return profileStore;
}

export default profileStoreSetup;
