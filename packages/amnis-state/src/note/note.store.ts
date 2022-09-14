import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './note.reducer';

export function noteStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const noteStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return noteStore;
}

export default noteStoreSetup;
