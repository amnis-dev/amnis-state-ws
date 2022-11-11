import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './audit.reducer.js';

export function auditStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const auditStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return auditStore;
}

export default auditStoreSetup;
