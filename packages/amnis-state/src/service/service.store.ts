import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './service.reducer';

export function serviceStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const serviceStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return serviceStore;
}

export default serviceStoreSetup;
