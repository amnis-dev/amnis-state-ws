import { rtk } from '@amnis/core';
import {
  apiSlice,
  apiInitialState,
  apiSelectors,
} from './api.js';

const storeSetup = () => {
  const reducers = rtk.combineReducers({
    [apiSlice.name]: apiSlice.reducer,
  });
  return rtk.configureStore({
    reducer: reducers,
  });
};

/**
 * ============================================================
 */
test('api should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().api,
  ).toEqual(apiInitialState);

  const apiAuthMeta = apiSelectors.selectById(store.getState(), 'apiAuth');
  expect(apiAuthMeta).toEqual({
    id: 'apiAuth',
    baseUrl: '/api/auth',
  });

  const apiCrudMeta = apiSelectors.selectById(store.getState(), 'apiCrud');
  expect(apiCrudMeta).toEqual({
    id: 'apiCrud',
    baseUrl: '/api/crud',
    bearerId: 'core',
  });
});
