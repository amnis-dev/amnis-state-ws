import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './token.reducer.js';

export function tokenStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const tokenStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return tokenStore;
}

export default tokenStoreSetup;
