import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from './contact.reducer';

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
