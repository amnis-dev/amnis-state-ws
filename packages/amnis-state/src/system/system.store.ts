import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './system.reducer.js';

export function systemStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const systemStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return systemStore;
}

export default systemStoreSetup;
