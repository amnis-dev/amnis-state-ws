import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './locale.reducer.js';

export function localeStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const localeStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return localeStore;
}

export default localeStoreSetup;
