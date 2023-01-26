import {
  IoInput,
  ioProcess,
  schemaAuth,
  schemaState,
  schemaEntity,
  Bearer,
  userKey,
  ioOutputErrored,
  StateUpdater,
  historyKey,
  profileKey,
  Profile,
  IoContext,
  databaseMemoryStorage,
  IoMap,
  Entity,
  User,
  ioOutput,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { authenticateFinalize } from '../utility/authenticate.js';
import { validateSetup } from '../validate.js';
import { processCrudUpdate } from './crud.update.js';

let context: IoContext;
let dataUsers: Entity<User>[];
let dataProfiles: Entity<Profile>[];
let io: IoMap<'update'>;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth, schemaState, schemaEntity]),
  });
  const storage = databaseMemoryStorage();
  dataUsers = Object.values(storage[userKey]) as Entity<User>[];
  dataProfiles = Object.values(storage[profileKey]) as Entity<Profile>[];

  io = ioProcess(
    context,
    {
      update: processCrudUpdate,
    },
  );
});

test('should not update without bearer', async () => {
  const inputUpdate: IoInput<StateUpdater> = {
    body: {
      [userKey]: [
        {
          // Admin user ID
          $id: dataUsers[0].$id,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(true);
  expect(outputUpdate.json.logs).toHaveLength(1);
  expect(outputUpdate.json.logs[0].level).toBe('error');
  expect(outputUpdate.json.result).toEqual({});
  expect(Object.keys(outputUpdate.json.result)).toHaveLength(0);
});

test('should login as administrator and update user email', async () => {
  const admin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    admin.$id,
    admin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [
        {
          // User ID
          $id: dataUsers[2].$id,
          email: 'new@amnis.dev',
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[userKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[userKey][0]).toMatchObject({
    $id: dataUsers[2].$id,
    handle: 'user',
  });
  expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
    changes: {
      email: expect.any(String),
    },
  });

  expect(outputUpdate.json.logs).toHaveLength(1);
  expect(ioOutputErrored(outputUpdate)).toBe(false);
});

test('should login as administrator and update profile display name', async () => {
  const admin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    admin.$id,
    admin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const nameNew = 'The New Administrator';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
    body: {
      [profileKey]: [
        {
          // User ID
          $id: dataProfiles[0].$id,
          nameDisplay: nameNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  // console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[profileKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[profileKey][0]).toMatchObject({
    $id: dataProfiles[0].$id,
    nameDisplay: nameNew,
  });

  expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
    changes: {
      nameDisplay: nameNew,
    },
  });
});

test('should login as executive and update user email', async () => {
  const exec = dataUsers.find((e) => e.handle === 'exec') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    exec.$id,
    exec.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const emailNew = 'new@email.com';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [
        {
          // User ID
          $id: dataUsers[2].$id,
          email: emailNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  // console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(false);

  expect(outputUpdate.json.result?.[userKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[userKey][0]).toMatchObject({
    $id: dataUsers[2].$id,
    email: emailNew,
  });
  expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
  expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
    changes: {
      email: emailNew,
    },
  });
});

test('should login as executive and NOT update user handle', async () => {
  const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    user.$id,
    user.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const handleNew = 'new_username';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: [
        {
          // User ID
          $id: dataUsers[2].$id,
          handle: handleNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(true);

  expect(Object.keys(outputUpdate.json.result)).toHaveLength(0);
});

test(
  'should login as user with updated credentials and update own profile display name',
  async () => {
    const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
    const outputLogin = await authenticateFinalize(
      context,
      user.$id,
      user.$credentials[0],
    );

    const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;
    const profile = outputLogin.json.result?.[profileKey][0] as Entity<Profile>;

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

    const outputUpdate = await io.update(inputUpdate, ioOutput());

    // console.log(JSON.stringify(outputUpdate, null, 2));
    expect(outputUpdate.status).toBe(200);
    expect(ioOutputErrored(outputUpdate)).toBe(false);

    expect(outputUpdate.json.result?.[profileKey]).toHaveLength(1);
    expect(outputUpdate.json.result?.[profileKey][0]).toMatchObject({
      $id: dataProfiles[2].$id,
      nameDisplay: nameNew,
    });

    expect(outputUpdate.json.result?.[historyKey]).toHaveLength(1);
    expect(outputUpdate.json.result?.[historyKey][0]).toMatchObject({
      changes: {
        nameDisplay: nameNew,
      },
    });
  },
);

test('should login as user and be denied updating another profile', async () => {
  const user = dataUsers.find((e) => e.handle === 'user') as Entity<User>;
  const outputLogin = await authenticateFinalize(
    context,
    user.$id,
    user.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;

  const nameNew = 'New Profile Name';
  const inputUpdate: IoInput<StateUpdater> = {
    accessEncoded: bearerAccess.access,
    body: {
      [profileKey]: [
        {
          // Admin Profile ID
          $id: dataProfiles[0].$id,
          nameDisplay: nameNew,
        },
      ],
    },
  };

  const outputUpdate = await io.update(inputUpdate, ioOutput());

  // console.log(JSON.stringify(outputUpdate, null, 2));
  expect(outputUpdate.status).toBe(200);
  expect(ioOutputErrored(outputUpdate)).toBe(true);

  expect(outputUpdate.json.logs).toHaveLength(1);
  expect(outputUpdate.json.logs[0].title).toBe('Updates Disallowed');
});
