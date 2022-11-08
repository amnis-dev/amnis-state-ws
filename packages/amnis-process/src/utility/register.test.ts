import {
  uid, Role, roleKey, systemCreate,
} from '@amnis/core';
import { dbmemory } from '@amnis/db';
import { register } from './register.js';

const system = systemCreate({
  name: 'Amnis Test System',
  $adminRole: uid<Role>(roleKey),
  $execRole: uid<Role>(roleKey),
  $initialRoles: [uid<Role>(roleKey), uid<Role>(roleKey)],
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output successfully.', async () => {
  const output = await register(
    dbmemory,
    system,
    'MyNewUser',
    {
      password: 'passwd12',
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
  expect(output.json.tokens).not.toBeDefined();
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output successfully with access tokens.', async () => {
  const output = await register(
    dbmemory,
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
  expect(output.json.tokens).toHaveLength(1);
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output errored without a password.', async () => {
  const output = await register(
    dbmemory,
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
    dbmemory,
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
  expect(output.json.tokens).not.toBeDefined();
});

/**
 * Registration is successful with proper input.
 */
test('should return registration output errored using oAuth username with password.', async () => {
  const output = await register(
    dbmemory,
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
