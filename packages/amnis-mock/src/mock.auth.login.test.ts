import { apiActions, apiAuth } from '@amnis/api';
import {
  contactKey,
  profileKey,
  sessionKey,
  userKey,
} from '@amnis/core';
import {
  contactSelectors,
  profileSelectors,
  sessionSelectors,
  userSelectors,
} from '@amnis/state';
import { setupServer } from 'msw/node';
import { authHandlers } from './mock.auth.js';
import { clientStore } from './common/client.store.js';

const baseUrl = 'https://amnis.dev';

clientStore.dispatch(apiActions.upsert({
  id: 'apiAuth',
  baseUrl: `${baseUrl}/api/auth`,
}));

const server = setupServer(...authHandlers({
  baseUrl,
}));

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('should be able to login', async () => {
  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    username: 'user',
    password: 'passwd12',
  }));

  if ('error' in result) {
    expect(result.error).toBeUndefined();
    return;
  }

  const { data } = result;

  expect(Object.keys(data.result || {})).toHaveLength(4);
  expect(data.bearers?.length).toBe(1);

  const state = clientStore.getState();
  const userActive = userSelectors.selectActive(state);
  const profileActive = profileSelectors.selectActive(state);
  const sessionActive = sessionSelectors.selectActive(state);
  const contactActive = contactSelectors.selectActive(state);

  expect(userActive?.$id).toBe(data.result?.[userKey][0].$id);
  expect(profileActive?.$id).toBe(data.result?.[profileKey][0].$id);
  expect(profileActive?.$user).toBe(userActive?.$id);
  expect(sessionActive?.$id).toBe(data.result?.[sessionKey][0].$id);
  expect(contactActive?.$id).toBe(data.result?.[contactKey][0].$id);
  expect(contactActive?.$id).toBe(profileActive?.$contact);
});
