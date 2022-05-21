---
to: "<%= path ? `${path}/${name}/${name}.store.ts` : null %>"
---
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './<%= name %>.reducer';

export function storeSetup() {
  const rootReducer = combineReducers(reducerMap);

  const <%= name %>Store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return <%= name %>Store;
}

export default storeSetup;
