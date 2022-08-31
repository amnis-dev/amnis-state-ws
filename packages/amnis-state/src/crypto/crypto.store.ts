import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './crypto.reducer';

export function cryptoStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const cryptoStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return cryptoStore;
}

export default cryptoStoreSetup;
