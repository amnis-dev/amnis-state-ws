import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './note.reducer.js';

export function noteStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const noteStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return noteStore;
}

export default noteStoreSetup;
