---
to: "<%= path ? `${path}/${name}/${name}.store.ts` : null %>"
---
import { configureStore, combineReducers } from '@amnis/core/rtk.js';
import { reducerMap, reducerMiddleware } from './<%= name %>.reducer.js';

export function <%= name %>StoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const <%= name %>Store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return <%= name %>Store;
}

export default <%= name %>StoreSetup;
