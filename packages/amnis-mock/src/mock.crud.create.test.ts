import { apiActions, apiAuth, apiCrud } from '@amnis/api';
import {
  contactKey,
  entityStrip,
  contactCreator,
  challengeKey,
  Entity,
  Challenge,
  authLoginCreate,
  accountsGet,
} from '@amnis/core';
import { contactActions, contactSelectors, userSelectors } from '@amnis/state';
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

test('should be able to create a new contact', async () => {
  /**
   * Get the user account information.
   */
  const { admin: adminAccount } = await accountsGet();

  /**
   * Must first begin the login ritual by obtaining a challenge code.
   */
  const resultInitiate = await clientStore.dispatch(apiAuth.endpoints.login.initiate({}));

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
    username: adminAccount.name,
    password: adminAccount.password,
    challenge,
    credential: adminAccount.credential,
    privateKeyWrapped: adminAccount.privateKey,
  });

  await clientStore.dispatch(apiAuth.endpoints.login.initiate(authLogin));

  const contactCreatorAction = contactActions.create(contactCreator({
    name: 'New Contact',
    emails: ['new@email.com'],
    phones: [],
    socials: [],
  }));
  const contactActionEntityId = contactCreatorAction.payload.entity.$id;

  /**
   * Locally create the entity.
   */
  clientStore.dispatch(contactCreatorAction);

  /**
   * Select the newly created entity.
   */
  const contactLocal = contactSelectors.selectById(clientStore.getState(), contactActionEntityId);
  if (!contactLocal) {
    expect(contactLocal).toBeDefined();
    return;
  }
  expect(contactLocal.committed).toBe(false);

  const contactStripped = entityStrip(contactLocal);
  const result = await clientStore.dispatch(apiCrud.endpoints.create.initiate({
    [contactKey]: [contactStripped],
  }));

  if ('error' in result) {
    expect(result.error).toBeUndefined();
    return;
  }

  const { data } = result;
  const contactResult = data.result?.[contactKey]?.[0];

  expect(contactResult).toBeDefined();

  const state = clientStore.getState();
  const user = userSelectors.selectActive(state);
  const contact = contactSelectors.selectById(state, contactResult?.$id || '');

  expect(contact).toMatchObject({
    name: 'New Contact',
    emails: ['new@email.com'],
    $creator: user?.$id,
    $owner: user?.$id,
  });
});
