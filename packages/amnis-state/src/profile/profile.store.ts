import { rtk } from '@amnis/core';
import { reducerMap, reducerMiddleware } from './profile.reducer.js';

export function profileStoreSetup() {
  const rootReducer = rtk.combineReducers(reducerMap);

  const profileStore = rtk.configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return profileStore;
}

export default profileStoreSetup;
