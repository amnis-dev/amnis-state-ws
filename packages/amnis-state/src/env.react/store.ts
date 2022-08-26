import { configureStore, combineReducers } from '@reduxjs/toolkit';
import reactSet from './set';

export function storeSetup() {
  const rootReducer = combineReducers(reactSet.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reactSet.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
