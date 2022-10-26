import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './token.reducer.js';

export function tokenStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const tokenStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return tokenStore;
}

export default tokenStoreSetup;
