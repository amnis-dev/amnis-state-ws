/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiAuth } from '@amnis/api';
// import type { IoOutputJson, StateCreate } from '@amnis/core';
import clientStore from './store.js';

test('should be able to query the auth api.', async () => {
  const action = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    username: '',
    password: '',
  }));

  expect('error' in action).toBe(true);
});
