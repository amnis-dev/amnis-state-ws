import { configureStore, combineReducers } from '@reduxjs/toolkit';
import nodeSet from './set.js';

export function storeSetup() {
  const rootReducer = combineReducers(nodeSet.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(nodeSet.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
