import { configureStore, combineReducers } from '@amnis/core/rtk.js';
import { set } from './set.js';

export function storeSetup() {
  const rootReducer = combineReducers(set.reducers);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(set.middleware)
    ),
  });

  return store;
}

export const store = storeSetup();

export type RootState = ReturnType<typeof store.getState>;

export default storeSetup;
