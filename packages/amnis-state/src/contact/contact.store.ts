import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './contact.reducer.js';

export function contactStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const contactStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return contactStore;
}

export default contactStoreSetup;
