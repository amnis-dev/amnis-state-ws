import {
  uid,
  Role,
  roleKey,
  systemCreator,
  IoContext,
  entityCreate,
  databaseMemory,
  filesystemMemory,
  cryptoWeb,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { register } from './register.js';

const appStore = storeSetup();

const context: IoContext = {
  store: appStore,
  database: databaseMemory,
  filesystem: filesystemMemory,
  crypto: cryptoWeb,
  validators: validateSetup([]),
};

const system = entityCreate(systemCreator({
  name: 'Amnis Test System',
  $adminRole: uid<Role>(roleKey),
  $execRole: uid<Role>(roleKey),
  $initialRoles: [uid<Role>(roleKey), uid<Role>(roleKey)],
}));

/**
 * Registration is successful with proper input.
 */
test('should return registration output successfully.', async () => {
  const output = await register(
    context,
    system,
    'MyNewUser',
    {
      password: 'passwd12',
    },
  );

  const user = output.json.result?.user?.[0];
  const profile = output.json.result?.profile?.[0];
  const contact = output.json.result?.contact?.[0];

  expect(output).toBeDefined();
  expect(output.status).toEqual(200);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs.some((log) => log.level === 'error')).toEqual(false);
  expect(output.json.result).toEqual({
    user: expect.any(Array),
    profile: expect.any(Array),
    contact: expect.any(Array),
  });
  expect(user).toBeDefined();
  expect(user).toMatchObject({
    $owner: user?.$id,
  });
  expect(profile).toBeDefined();
  expect(profile).toMatchObject({
    $owner: user?.$id,
    $creator: user?.$id,
  });
  expect(contact).toBeDefined();
  expect(contact).toMatchObject({
    $owner: user?.$id,
    $creator: user?.$id,
  });

  expect(output.json.bearers).not.toBeDefined();
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output successfully with access bearers.', async () => {
  const output = await register(
    context,
    system,
    'MyNewUser',
    {
      password: 'passwd12',
      withTokens: true,
    },
  );

  expect(output).toBeDefined();
  expect(output.status).toEqual(200);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs.some((log) => log.level === 'error')).toEqual(false);
  expect(output.json.result).toEqual({
    user: expect.any(Array),
    profile: expect.any(Array),
    contact: expect.any(Array),
  });
  expect(output.json.result?.user).toHaveLength(1);
  expect(output.json.result?.profile).toHaveLength(1);
  expect(output.json.result?.contact).toHaveLength(1);
  expect(output.json.bearers).toHaveLength(1);
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output errored without a password.', async () => {
  const output = await register(
    context,
    system,
    'MyNewUser',
    {},
  );

  expect(output).toBeDefined();
  expect(output.status).toEqual(400);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs.some((log) => log.level === 'error')).toEqual(true);
  expect(output.json.result).not.toBeDefined();
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output successfully using oAuth username.', async () => {
  const output = await register(
    context,
    system,
    'TW#MyNewUser',
    {},
  );

  expect(output).toBeDefined();
  expect(output.status).toEqual(200);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs.some((log) => log.level === 'error')).toEqual(false);
  expect(output.json.result).toEqual({
    user: expect.any(Array),
    profile: expect.any(Array),
    contact: expect.any(Array),
  });
  expect(output.json.result?.user).toHaveLength(1);
  expect(output.json.result?.profile).toHaveLength(1);
  expect(output.json.result?.contact).toHaveLength(1);
  expect(output.json.bearers).not.toBeDefined();
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output errored using oAuth username with password.', async () => {
  const output = await register(
    context,
    system,
    'TW#MyNewUser',
    {
      password: 'passwd12',
    },
  );

  expect(output).toBeDefined();
  expect(output.status).toEqual(400);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs.some((log) => log.level === 'error')).toEqual(true);
  expect(output.json.result).not.toBeDefined();
});
