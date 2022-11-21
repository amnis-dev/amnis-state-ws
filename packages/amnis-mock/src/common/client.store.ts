import { stateSet } from '@amnis/state';
import { apiSet } from '@amnis/api';
import { rtk } from '@amnis/core';

const reducers = rtk.combineReducers({
  ...stateSet.reducers,
  ...apiSet.reducers,
});

export const clientStore = rtk.configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat([...stateSet.middleware, ...apiSet.middleware])
  ),
});

export default clientStore;
