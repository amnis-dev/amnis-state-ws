import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './website.reducer.js';

export function websiteStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const websiteStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return websiteStore;
}

export default websiteStoreSetup;
