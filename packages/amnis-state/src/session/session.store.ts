import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './session.reducer.js';

export function sessionStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const sessionStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return sessionStore;
}

export default sessionStoreSetup;
