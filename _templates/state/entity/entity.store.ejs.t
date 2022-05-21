---
to: <%= `${cwd}/${name}/${name}.store.ts` %>
---
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './<%= name %>.reducer';

export function storeSetup() {
  const rootReducer = combineReducers(reducerMap);

  const userStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return userStore;
}

export default storeSetup;
