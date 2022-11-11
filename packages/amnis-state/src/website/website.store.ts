import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './website.reducer.js';

export function websiteStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const websiteStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return websiteStore;
}

export default websiteStoreSetup;
