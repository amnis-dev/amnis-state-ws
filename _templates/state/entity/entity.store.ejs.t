---
to: "<%= path ? `${path}/${name}/${name}.store.ts` : null %>"
---
import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './<%= name %>.reducer.js';

export function <%= name %>StoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const <%= name %>Store = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return <%= name %>Store;
}

export default <%= name %>StoreSetup;
