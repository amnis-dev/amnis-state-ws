import { apiActions, apiAuth } from '@amnis/api';
import {
  contactKey, profileKey, sessionKey, userKey,
} from '@amnis/core';
import {
  bearerSelectors, contactSelectors, profileSelectors, sessionSelectors, userSelectors,
} from '@amnis/state';
import { clientStore } from './common/client.store.js';
import { mockService } from './mock.service.js';

const baseUrl = 'https://amnis.dev';

clientStore.dispatch(apiActions.upsertMany([
  { id: 'apiAuth', baseUrl: `${baseUrl}/api/auth` },
  { id: 'apiCrud', baseUrl: `${baseUrl}/api/crud` },
]));

beforeAll(async () => {
  await mockService.setup({ baseUrl });
  mockService.start();
});

afterAll(() => {
  mockService.stop();
});

test('should register a new account', async () => {
  const response = await clientStore.dispatch(apiAuth.endpoints.register.initiate({
    handle: 'newbie',
    password: 'newpass123',
    email: 'newbie@newbie.addr',
    nameDisplay: 'Newbie User',
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data: { logs, result, bearers } } = response;

  if (!result || !bearers) {
    expect(result).toBeDefined();
    expect(bearers).toBeDefined();
    return;
  }

  expect(logs.length).toBeGreaterThanOrEqual(1);

  const userActive = userSelectors.selectActive(clientStore.getState());
  const profileActive = profileSelectors.selectActive(clientStore.getState());
  const contactActive = contactSelectors.selectActive(clientStore.getState());
  const sessionActive = sessionSelectors.selectActive(clientStore.getState());

  const bearerActive = bearerSelectors.selectById(clientStore.getState(), 'core');

  if (
    !userActive
    || !profileActive
    || !contactActive
    || !sessionActive
    || !bearerActive
  ) {
    expect(userActive).toBeDefined();
    expect(profileActive).toBeDefined();
    expect(contactActive).toBeDefined();
    expect(sessionActive).toBeDefined();
    expect(bearerActive).toBeDefined();
    return;
  }

  expect(userActive).toEqual(result[userKey][0]);
  expect(profileActive).toEqual(result[profileKey][0]);
  expect(contactActive).toEqual(result[contactKey][0]);
  expect(sessionActive).toEqual(result[sessionKey][0]);
  expect(bearerActive).toEqual(bearers[0]);
});
