import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './user.reducer.js';

export function userStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const userStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });

  return userStore;
}

export default userStoreSetup;
