import { apiActions, apiAuth } from '@amnis/api';
import {
  contactSelectors,
  profileSelectors,
  sessionSelectors,
  userSelectors,
} from '@amnis/state';
import {
  accountsGet, authLoginCreate, Challenge, challengeKey, Entity, selectBearer,
} from '@amnis/core';
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

test('should be able to login and logout', async () => {
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

  /** s
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

  await clientStore.dispatch(apiAuth.endpoints.login.initiate(authLogin));

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

  const bearerToken = selectBearer(state, 'core');

  expect(sessionActive).toBeUndefined();
  expect(userActive).toBeUndefined();
  expect(profileActive).toBeUndefined();
  expect(contactActive).toBeUndefined();
  expect(bearerToken).toBeUndefined();
});
