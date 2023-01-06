import { apiActions, apiAuth } from '@amnis/api';
import {
  accountsGet, agentUpdate, contactKey, profileKey, userKey,
} from '@amnis/core';
import { contactSelectors, profileSelectors, userSelectors } from '@amnis/state';
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

test('should NOT create a new account as a regular user', async () => {
  /**
   * Set the agent credentials to the user.
   */
  const { user } = await accountsGet();
  await agentUpdate({
    credentialId: user.credential.$id,
    privateKey: user.privateKey,
  });

  /**
   * Login
   */
  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: user.handle,
    password: user.password,
  }));

  /**
   * Create the new account.
   */
  const response = await clientStore.dispatch(apiAuth.endpoints.create.initiate({
    handle: 'newbie',
    password: 'newpass123',
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  expect(response.data.result).toBeUndefined();
  expect(response.data.logs).toHaveLength(1);
  expect(response.data.logs[0].level).toBe('error');
  expect(response.data.logs[0].title).toBe('Unauthorized');
});

test('should create a new account as a privileged account', async () => {
  /**
   * Set the agent credentials to the administrators.
   */
  const { admin } = await accountsGet();
  await agentUpdate({
    credentialId: admin.credential.$id,
    privateKey: admin.privateKey,
  });

  /**
   * Login
   */
  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: admin.handle,
    password: admin.password,
  }));

  /**
   * Create the new account.
   */
  const response = await clientStore.dispatch(apiAuth.endpoints.create.initiate({
    handle: 'newbie',
    password: 'newpass123',
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data: { logs, result } } = response;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(logs).toHaveLength(1);
  expect(logs[0].level).toBe('success');
  expect(logs[0].title).toBe('Account Created');

  expect(Object.keys(result).length).toBe(4);

  const user = userSelectors.selectById(clientStore.getState(), result[userKey][0].$id);
  const profile = profileSelectors.selectById(clientStore.getState(), result[profileKey][0].$id);
  const contact = contactSelectors.selectById(clientStore.getState(), result[contactKey][0].$id);

  if (!user || !profile || !contact) {
    expect(user).toBeDefined();
    expect(profile).toBeDefined();
    expect(contact).toBeDefined();
    return;
  }

  expect(user).toEqual(result[userKey][0]);
  expect(profile).toEqual(result[profileKey][0]);
  expect(contact).toEqual(result[contactKey][0]);
});
