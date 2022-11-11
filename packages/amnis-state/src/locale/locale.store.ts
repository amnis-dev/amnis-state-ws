import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './locale.reducer.js';

export function localeStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const localeStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return localeStore;
}

export default localeStoreSetup;
