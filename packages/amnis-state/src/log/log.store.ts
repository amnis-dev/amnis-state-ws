import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './log.reducer.js';

export function logStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const logStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return logStore;
}

export default logStoreSetup;
