import { configureStore, combineReducers } from '@amnis/core/rtk.js';
import reactSet from './set.js';

export function storeSetup() {
  const rootReducer = combineReducers(reactSet.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reactSet.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
