import { configureStore, combineReducers } from '@amnis/core/rtk.js';
import { reducerMap, reducerMiddleware } from './profile.reducer.js';

export function profileStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const profileStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return profileStore;
}

export default profileStoreSetup;
