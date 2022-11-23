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

test('should be able to login and logout', async () => {
  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    username: 'user',
    password: 'passwd12',
  }));

  const sessionLoginActive = sessionSelectors.selectActive(clientStore.getState());

  const result = await clientStore.dispatch(apiAuth.endpoints.logout.initiate({}));

  if ('error' in result) {
    expect(result.error).toBeUndefined();
    return;
  }

  const { data } = result;
  expect(data.result?.session?.[0]).toEqual(sessionLoginActive?.$id);

  const state = clientStore.getState();
  const sessionActive = sessionSelectors.selectActive(state);
  const userActive = userSelectors.selectActive(state);
  const profileActive = profileSelectors.selectActive(state);
  const contactActive = contactSelectors.selectActive(state);

  expect(sessionActive).toBeUndefined();
  expect(userActive).toBeUndefined();
  expect(profileActive).toBeUndefined();
  expect(contactActive).toBeUndefined();
});
