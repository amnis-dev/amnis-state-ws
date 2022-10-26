import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './service.reducer.js';

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
