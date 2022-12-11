import { apiActions, apiAuth, apiCrud } from '@amnis/api';
import {
  accountsGet,
  auditKey,
  authLoginCreate,
  Challenge,
  challengeKey,
  contactKey,
  Entity,
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

test('should be able to login as user', async () => {
  /**
   * Get the user account information.
   */
  const { user } = await accountsGet();

  /**
   * Must first begin the login ritual by obtaining a challenge code.
   */
  const resultInitiate = await clientStore.dispatch(apiAuth.endpoints.challenge.initiate({}));

  if ('error' in resultInitiate) {
    expect(resultInitiate.error).toBeUndefined();
    return;
  }

  /**
   * Extract the challenge.
   */
  const challenge = resultInitiate.data.result?.[challengeKey][0] as Entity<Challenge>;

  /**
   * Create the login request body.
   */
  const authLogin = await authLoginCreate({
    username: user.name,
    password: user.password,
    challenge,
    credential: user.credential,
    privateKeyWrapped: user.privateKey,
  });

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate(authLogin));

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

test('should NOT be able to login with a bad password', async () => {
  /**
   * Get the user account information.
   */
  const { user } = await accountsGet();

  /**
   * Must first begin the login ritual by obtaining a challenge code.
   */
  const resultInitiate = await clientStore.dispatch(apiAuth.endpoints.challenge.initiate({}));

  if ('error' in resultInitiate) {
    expect(resultInitiate.error).toBeUndefined();
    return;
  }

  /**
   * Extract the challenge.
   */
  const challenge = resultInitiate.data.result?.[challengeKey][0] as Entity<Challenge>;

  /**
   * Create the login request body.
   */
  const authLogin = await authLoginCreate({
    username: user.name,
    password: user.password.slice(1),
    challenge,
    credential: user.credential,
    privateKeyWrapped: user.privateKey,
  });

  const result = await clientStore.dispatch(apiAuth.endpoints.login.initiate(authLogin));

  if ('error' in result) {
    expect(result.error).toBeUndefined();
    return;
  }

  const { data } = result;
  const { logs } = data;

  expect(logs).toHaveLength(1);
  expect(logs?.[0]?.title).toBe('Authentication Failed: Wrong Password');
});

test('should see audits of login requests as admin', async () => {
  /**
   * Get the user account information.
   */
  const { admin } = await accountsGet();

  /**
   * Must first begin the login ritual by obtaining a challenge code.
   */
  const resultInitiate = await clientStore.dispatch(apiAuth.endpoints.challenge.initiate({}));

  if ('error' in resultInitiate) {
    expect(resultInitiate.error).toBeUndefined();
    return;
  }

  /**
   * Extract the challenge.
   */
  const challenge = resultInitiate.data.result?.[challengeKey][0] as Entity<Challenge>;

  /**
   * Create the login request body.
   */
  const authLogin = await authLoginCreate({
    username: admin.name,
    password: admin.password,
    challenge,
    credential: admin.credential,
    privateKeyWrapped: admin.privateKey,
  });

  const resultLogin = await clientStore.dispatch(apiAuth.endpoints.login.initiate(authLogin));

  if ('error' in resultLogin) {
    expect(resultLogin.error).toBeUndefined();
    return;
  }

  const resultAudits = await clientStore.dispatch(apiCrud.endpoints.read.initiate({
    [auditKey]: {
      $query: {},
      $range: {
        limit: 10,
      },
    },
  }));

  const { data } = resultAudits;

  expect(Object.keys(data?.result || {})).toHaveLength(1);
  expect(data?.result?.[auditKey]).toHaveLength(6);
});
