import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './note.reducer.js';

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
