import { configureStore, combineReducers } from '@amnis/core/rtk.js';
import nodeSet from './set.js';

export function storeSetup() {
  const rootReducer = combineReducers(nodeSet.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(nodeSet.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
