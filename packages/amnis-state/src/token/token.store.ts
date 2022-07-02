import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './token.reducer';

export function tokenStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const tokenStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return tokenStore;
}

export default tokenStoreSetup;
