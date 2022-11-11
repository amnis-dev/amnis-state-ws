import { rtk } from '@amnis/core';
import { stateSet } from '@amnis/state';
import { apiSet } from '@amnis/api';

/**
 * Setup your Redux store.
 */
const rootReducer = rtk.combineReducers({
  ...stateSet.reducers,
  ...apiSet.reducers,
});

export const store = rtk.configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(apiSet.middleware)
  ),
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
