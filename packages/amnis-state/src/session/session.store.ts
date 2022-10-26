import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './session.reducer.js';

export function sessionStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const sessionStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return sessionStore;
}

export default sessionStoreSetup;
