import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { set } from './set';

export function storeSetup() {
  const rootReducer = combineReducers(set.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(set.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
