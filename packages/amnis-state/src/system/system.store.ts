import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './system.reducer.js';

export function systemStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const systemStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return systemStore;
}

export default systemStoreSetup;
