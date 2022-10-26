import { apiAuth } from '@amnis/api';
import clientStore from './store.js';

test('should be able to query the auth api.', async () => {
  const action = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    username: '',
    password: '',
  }));

  expect(action.isError).toBe(true);
});
