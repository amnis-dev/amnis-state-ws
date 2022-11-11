import { rtk } from '@amnis/core';
import { stateSet } from './set.js';

export function storeSetup() {
  const rootReducer = rtk.combineReducers(stateSet.reducers);

  const store = rtk.configureStore({
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
