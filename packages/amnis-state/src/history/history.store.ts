import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './history.reducer.js';

export function historyStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const historyStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return historyStore;
}

export default historyStoreSetup;
