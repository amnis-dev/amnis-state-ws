import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { stateSet } from './set.js';

/**
 * Configures a default store.
 */
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

/**
 * Configures a default context store.
 */
export function storeContextSetup() {
  const {
    system,
    challenge,
    otp,
    key,
    role,
    user,
    credential,
    profile,
    contact,
  } = stateSet.reducers;
  const rootReducer = combineReducers({
    system,
    challenge,
    otp,
    key,
    role,
    user,
    credential,
    profile,
    contact,
  });

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
