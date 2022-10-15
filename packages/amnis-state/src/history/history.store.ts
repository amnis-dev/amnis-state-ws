import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './history.reducer.js';

export function historyStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const historyStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return historyStore;
}

export default historyStoreSetup;
