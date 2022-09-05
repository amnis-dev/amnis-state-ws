import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './audit.reducer';

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
