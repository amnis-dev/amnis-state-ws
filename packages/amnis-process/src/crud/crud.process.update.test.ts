import { dbmemory } from '@amnis/db';
import { fsmemory } from '@amnis/fs';
import {
  AuthLogin,
  dataInitial,
  IoInput,
  ioProcess,
  schemaAuth,
  schemaState,
  schemaEntity,
  Bearer,
  userKey,
  ioOutputErrored,
  coreActions,
  StateUpdater,
  historyKey,
  profileKey,
  Profile,
  stateEntitiesCreate,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { cryptoWeb } from '@amnis/crypto';
import { validateSetup } from '../validate.js';
import { authProcessLogin } from '../auth/auth.login.js';
import { crudProcessUpdate } from './crud.process.update.js';

const data = dataInitial();
const store = storeSetup();

const io = ioProcess(
  {
    store,
    validators: validateSetup([schemaAuth, schemaState, schemaEntity]),
    database: dbmemory,
    filesystem: fsmemory,
    crypto: cryptoWeb,
  },
  {
    login: authProcessLogin,
    update: crudProcessUpdate,
  },
);

beforeAll(async () => {
  const stateEntities = stateEntitiesCreate(data);
  store.dispatch(coreActions.create(stateEntities));
  await dbmemory.create(stateEntities);
});

test('should not update without bearer', async () => {
  const inputUpdate: IoInput<StateUpdater> = {
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
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
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

test('should login as administrator and update profile display name', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'admin',
      password: 'passwd12',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const nameNew = 'The New Administrator';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
    body: {
      [profileKey]: [
        {
          // User ID
          $id: data[profileKey][0].$id,
          nameDisplay: nameNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate);

  // console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[profileKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[profileKey][0]).toMatchObject({
    $id: data[profileKey][0].$id,
    nameDisplay: nameNew,
  });

  expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
    update: {
      $id: data[profileKey][0].$id,
      nameDisplay: nameNew,
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
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const nameNew = 'userupdated';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
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
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const profile = outputLogin.json.result?.[profileKey][0] as Profile;

  const nameNew = 'The New User Me';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
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

  // console.log(JSON.stringify(outputUpdate, null, 2));
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

test('should login as user and be denied updating another profile', async () => {
  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: 'userupdated',
      password: 'newpass34',
    },
  };

  const outputLogin = await io.login(inputLogin);
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const nameNew = 'New Profile Name';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
    body: {
      [profileKey]: [
        {
          // Admin Profile ID
          $id: data[profileKey][0].$id,
          nameDisplay: nameNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate);

  // console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(true);

  expect(outputUpdate.json.logs).toHaveLength(1);
  expect(outputUpdate.json.logs[0].title).toBe('Updates Disallowed');
});
