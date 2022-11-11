import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './service.reducer.js';

export function serviceStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const serviceStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return serviceStore;
}

export default serviceStoreSetup;
