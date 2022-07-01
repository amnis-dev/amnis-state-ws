import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './reducer';

export function storeSetup() {
  const rootReducer = combineReducers(reducerMap);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
