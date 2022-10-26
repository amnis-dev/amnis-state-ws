import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './audit.reducer.js';

export function auditStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const auditStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return auditStore;
}

export default auditStoreSetup;
