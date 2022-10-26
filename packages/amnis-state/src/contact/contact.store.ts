import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './contact.reducer.js';

export function contactStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const contactStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return contactStore;
}

export default contactStoreSetup;
