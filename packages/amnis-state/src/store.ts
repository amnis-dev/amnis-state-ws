import { rtk } from '@amnis/core';
import { stateSet } from './set.js';

/**
 * Configures a default store.
 */
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

/**
 * Configures a default context store.
 */
export function storeContextSetup() {
  const {
    system,
    challenge,
    key,
    role,
    user,
    credential,
    profile,
    contact,
  } = stateSet.reducers;
  const rootReducer = rtk.combineReducers({
    system,
    challenge,
    key,
    role,
    user,
    credential,
    profile,
    contact,
  });

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
