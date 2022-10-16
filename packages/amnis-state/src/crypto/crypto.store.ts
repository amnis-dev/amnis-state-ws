import { configureStore, combineReducers } from '@amnis/core/rtk.js';
import { reducerMap, reducerMiddleware } from './crypto.reducer.js';

export function cryptoStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const cryptoStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return cryptoStore;
}

export default cryptoStoreSetup;
