import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  apiSlice,
  apiInitialState,
  apiSelectors,
} from './api.js';

const storeSetup = () => {
  const reducers = combineReducers({
    [apiSlice.name]: apiSlice.reducer,
  });
  return configureStore({
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
    signature: ['login', 'register', 'credential', 'create'],
    challenge: ['login', 'register', 'credential', 'create'],
    otp: ['credential'],
  });

  const apiCrudMeta = apiSelectors.selectById(store.getState(), 'apiCrud');
  expect(apiCrudMeta).toEqual({
    id: 'apiCrud',
    baseUrl: '/api/crud',
    bearerId: 'core',
  });
});
