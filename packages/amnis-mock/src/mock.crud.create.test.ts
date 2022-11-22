import { apiActions, apiAuth, apiCrud } from '@amnis/api';
import {
  contactCreator,
  contactKey,
} from '@amnis/core';
import { setupServer } from 'msw/node';
import { contactSelectors, userSelectors } from '@amnis/state';
import { authHandlers } from './mock.auth.js';
import { crudHandlers } from './mock.crud.js';
import { clientStore } from './common/client.store.js';

const baseUrl = 'https://amnis.dev';

clientStore.dispatch(apiActions.upsertMany([
  {
    id: 'apiAuth',
    baseUrl: `${baseUrl}/api/auth`,
  },
  {
    id: 'apiCrud',
    baseUrl: `${baseUrl}/api/crud`,
  },
]));

const server = setupServer(
  ...authHandlers({ baseUrl }),
  ...crudHandlers({ baseUrl }),
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('should be able to create a new contact', async () => {
  // Must login to obtain token permitted to create entities.
  await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    username: 'admin',
    password: 'passwd12',
  }));

  const result = await clientStore.dispatch(apiCrud.endpoints.create.initiate({
    [contactKey]: [
      contactCreator({
        name: 'New Contact',
        emails: ['new@email.com'],
      }),
    ],
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