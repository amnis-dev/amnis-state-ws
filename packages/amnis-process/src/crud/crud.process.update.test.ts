import { memory } from '@amnis/db';
import {
  AuthLogin,
  dataInitial,
  IoInput,
  ioProcess,
  schemaAuth,
  schemaState,
  schemaEntity,
  Token,
  userKey,
  ioOutputErrored,
  coreActions,
  StateUpdate,
  historyKey,
  profileKey,
  Profile,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessLogin } from '../auth/auth.login.js';
import { crudProcessUpdate } from './crud.process.update.js';

const data = dataInitial();
const store = storeSetup();

const io = ioProcess(
  {
    store,
    validators: validateSetup([schemaAuth, schemaState, schemaEntity]),
    database: memory,
  },
  {
    login: authProcessLogin,
    update: crudProcessUpdate,
  },
);

beforeAll(async () => {
  store.dispatch(coreActions.create(data));
  await memory.create(data);
});

test('should not update without token', async () => {
  const inputUpdate: IoInput<StateUpdate> = {
    body: {
      [userKey]: [
        {
          // Admin user ID
          $id: data[userKey][0].$id,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate);

  expect(outputUpdate.status).toBe(401);
});

test('should login as administrator and update user password', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'admin',
      password: 'passwd12',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const tokenAccess = outputLogin.json.tokens?.[0] as Token;

  const inputUpdate: IoInput<StateUpdate> = {
    jwtEncoded: tokenAccess.jwt,
    body: {
      [userKey]: [
        {
          // User ID
          $id: data[userKey][2].$id,
          password: 'newpass34',
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate);

  // console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[userKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[userKey][0]).toMatchObject({
    $id: data[userKey][2].$id,
    name: 'user',
  });
  expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
    update: {
      $id: data[userKey][2].$id,
      password: expect.any(String),
    },
  });
});

test('should login as executive and update user name', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'exec',
      password: 'passwd12',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const tokenAccess = outputLogin.json.tokens?.[0] as Token;

  const nameNew = 'userupdated';
  const inputUpdate: IoInput<StateUpdate> = {
    jwtEncoded: tokenAccess.jwt,
    body: {
      [userKey]: [
        {
          // User ID
          $id: data[userKey][2].$id,
          name: nameNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate);

  // console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[userKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[userKey][0]).toMatchObject({
    $id: data[userKey][2].$id,
    name: nameNew,
  });
  expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
    update: {
      $id: data[userKey][2].$id,
      name: nameNew,
    },
  });
});

test('should login as user with updated credentials and update own profile display name', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'userupdated',
      password: 'newpass34',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const tokenAccess = outputLogin.json.tokens?.[0] as Token;

  const profile = outputLogin.json.result?.[profileKey][0] as Profile;

  const nameNew = 'The New User Me';
  const inputUpdate: IoInput<StateUpdate> = {
    jwtEncoded: tokenAccess.jwt,
    body: {
      [profileKey]: [
        {
          // User Profile
          $id: profile.$id,
          nameDisplay: nameNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate);

  console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[profileKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[profileKey][0]).toMatchObject({
    $id: data[profileKey][2].$id,
    nameDisplay: nameNew,
  });

  expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
    update: {
      $id: data[profileKey][2].$id,
      nameDisplay: nameNew,
    },
  });
});
