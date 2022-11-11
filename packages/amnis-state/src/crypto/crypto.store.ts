import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './crypto.reducer.js';

export function cryptoStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const cryptoStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return cryptoStore;
}

export default cryptoStoreSetup;
