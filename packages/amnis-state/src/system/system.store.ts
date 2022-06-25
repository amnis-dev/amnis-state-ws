import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './system.reducer';

export function systemStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const systemStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return systemStore;
}

export default systemStoreSetup;
