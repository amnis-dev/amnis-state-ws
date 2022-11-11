import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './role.reducer.js';

export function roleStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const roleStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return roleStore;
}

export default roleStoreSetup;
