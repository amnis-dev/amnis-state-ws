import { apiActions, apiAuth, apiCrud } from '@amnis/api';
import {
  accountsGet,
  authLoginCreate,
  Entity,
  History,
  historyKey,
  Profile,
  profileKey,
} from '@amnis/core';
import {
  historySelectors,
  profileActions, profileSelectors,
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

test('should be able to update user profile', async () => {
  /**
   * Get the user account information.
   */
  const { admin: adminAccount } = await accountsGet();

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
  const challenge = resultInitiate.data?.result;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  /**
   * Create the login request body.
   */
  const authLogin = await authLoginCreate({
    username: adminAccount.name,
    password: adminAccount.password,
    challenge,
    credential: adminAccount.credential,
    privateKeyWrapped: adminAccount.privateKey,
  });

  await clientStore.dispatch(apiAuth.endpoints.login.initiate(authLogin));

  /**
   * Read profiles to put them in the state.
   */
  await clientStore.dispatch(apiCrud.endpoints.read.initiate({
    [profileKey]: {
      $query: {},
    },
  }));

  const profiles = profileSelectors.selectAll(clientStore.getState());
  expect(profiles).toHaveLength(3);

  const userProfile = profiles.find((profile) => profile.nameDisplay === 'User');
  if (!userProfile) {
    expect(userProfile).toBeDefined();
    return;
  }
  expect(userProfile.committed).toBe(true);

  /**
   * Update the user profile locally.
   */
  clientStore.dispatch(profileActions.update({ $id: userProfile.$id, nameDisplay: 'UserUp' }));
  const userProfileUp1 = profileSelectors.selectById(clientStore.getState(), userProfile.$id);
  const {
    original: userProfileUp1Original,
    changes: userProfileUp1Changes,
  } = profileSelectors.selectDifference(clientStore.getState(), userProfile.$id);
  if (!userProfileUp1) {
    expect(userProfileUp1).toBeDefined();
    return;
  }
  expect(userProfileUp1.nameDisplay).toBe('UserUp');
  expect(userProfileUp1.committed).toBe(false);
  expect(userProfileUp1Original).toMatchObject(userProfile);
  expect(userProfileUp1Changes).toMatchObject({ nameDisplay: 'UserUp' });

  /**
   * Update to match the original object.
   */
  clientStore.dispatch(profileActions.update({ $id: userProfile.$id, nameDisplay: 'User' }));
  const userProfileUp2 = profileSelectors.selectById(clientStore.getState(), userProfile.$id);
  const {
    original: userProfileUp2Original,
    changes: userProfileUp2Changes,
  } = profileSelectors.selectDifference(clientStore.getState(), userProfile.$id);
  if (!userProfileUp2) {
    expect(userProfileUp2).toBeDefined();
    return;
  }
  expect(userProfileUp2.nameDisplay).toBe('User');
  expect(userProfileUp2.committed).toBe(true);
  expect(userProfileUp2Original).toBeUndefined();
  expect(userProfileUp2Changes).toEqual({});

  /**
   * Last local update...
   */
  clientStore.dispatch(profileActions.update({ $id: userProfile.$id, nameDisplay: 'UserUpdated' }));
  const userProfileUp3 = profileSelectors.selectById(clientStore.getState(), userProfile.$id);
  const {
    original: userProfileUp3Original,
    changes: userProfileUp3Changes,
    updator: userProfileUp3Update,
  } = profileSelectors.selectDifference(clientStore.getState(), userProfile.$id);
  if (!userProfileUp3) {
    expect(userProfileUp3).toBeDefined();
    return;
  }
  expect(userProfileUp3.nameDisplay).toBe('UserUpdated');
  expect(userProfileUp3.committed).toBe(false);
  expect(userProfileUp3Original).toMatchObject(userProfile);
  expect(userProfileUp3Changes).toEqual({ nameDisplay: 'UserUpdated' });

  /**
   * Push update to the mocked server.
   */
  const resultUpdate = await clientStore.dispatch(
    apiCrud.endpoints.update.initiate({
      [profileKey]: [userProfileUp3Update],
    }),
  );
  if ('error' in resultUpdate) {
    expect(resultUpdate.error).toBeUndefined();
    return;
  }

  const { data } = resultUpdate;
  const profileUpdated = data.result?.[profileKey][0] as Entity<Profile>;
  const profileHistory = data.result?.[historyKey][0] as Entity<History>;
  if (!profileUpdated || !profileHistory) {
    expect(profileUpdated).toBeDefined();
    expect(profileHistory).toBeDefined();
    return;
  }

  expect(profileUpdated.committed).toBe(true);
  expect(profileHistory.changes).toMatchObject({
    nameDisplay: 'UserUpdated',
  });

  const profileClient = profileSelectors.selectById(
    clientStore.getState(),
    userProfileUp3Update.$id,
  );
  expect(profileClient).toMatchObject(profileUpdated);

  const historyClient = historySelectors.selectById(
    clientStore.getState(),
    profileHistory.$id,
  );
  expect(historyClient).toMatchObject(profileHistory);
});
