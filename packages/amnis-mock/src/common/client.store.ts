import { stateSet } from '@amnis/state';
import { apiSet } from '@amnis/api';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducers = combineReducers({
  ...stateSet.reducers,
  ...apiSet.reducers,
});

export const clientStore = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat([...stateSet.middleware, ...apiSet.middleware])
  ),
});

export default clientStore;
