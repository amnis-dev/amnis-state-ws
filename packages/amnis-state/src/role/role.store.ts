import { configureStore, combineReducers } from '@amnis/core/rtk';
import { reducerMap, reducerMiddleware } from './role.reducer.js';

export function roleStoreSetup() {
  const rootReducer = combineReducers(reducerMap);

  const roleStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware().concat(reducerMiddleware)
    ),
  });
  return roleStore;
}

export default roleStoreSetup;
