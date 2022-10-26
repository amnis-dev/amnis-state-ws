import { configureStore, combineReducers } from '@amnis/core/rtk';
import { stateSet } from './set.js';

export function storeSetup() {
  const rootReducer = combineReducers(stateSet.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(stateSet.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
