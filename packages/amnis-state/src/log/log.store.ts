import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './log.reducer.js';

export function logStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const logStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return logStore;
}

export default logStoreSetup;
