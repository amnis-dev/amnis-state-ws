import { configureStore, combineReducers } from '@reduxjs/toolkit';
import browserSet from './set.js';

export function storeSetup() {
  const rootReducer = combineReducers(browserSet.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(browserSet.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
