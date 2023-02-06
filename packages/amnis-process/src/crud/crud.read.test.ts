import {
  IoInput,
  ioProcess,
  schemaAuth,
  schemaEntity,
  Bearer,
  userKey,
  ioOutputErrored,
  User,
  databaseMemoryStorage,
  Entity,
  IoContext,
  IoMap,
  schemaState,
  ioOutput,
  StateQuery,
  profileKey,
  Credential,
  credentialKey,
  roleKey,
  Role,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { authenticateFinalize } from '../utility/authenticate.js';
import { validateSetup } from '../validate.js';
import { processCrudRead } from './crud.read.js';

let context: IoContext;
let userAdmin: Entity<User>;
let io: IoMap<'read'>;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth, schemaState, schemaEntity]),
  });
  const storage = databaseMemoryStorage();
  const dataUsers = Object.values(storage[userKey]) as Entity<User>[];
  userAdmin = dataUsers.find((e) => e.handle === 'admin') as Entity<User>;

  io = ioProcess(
    context,
    {
      read: processCrudRead,
    },
  );
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should not read user without access', async () => {
  const input: IoInput<StateQuery> = {
    body: {
      [userKey]: {
        $query: {},
      },
    },
  };

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(true);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.result).toEqual({});
  expect(Object.keys(output.json.result)).toHaveLength(0);
});

test('should read profile without access', async () => {
  const input: IoInput<StateQuery> = {
    body: {
      [profileKey]: {
        $query: {},
      },
    },
  };

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(false);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('success');
  expect(output.json.result).toMatchObject({
    [profileKey]: expect.any(Array),
  });
  expect(Object.keys(output.json.result).length).toBe(1);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should login as administrator read users', async () => {
  const outputLogin = await authenticateFinalize(
    context,
    userAdmin.$id,
    userAdmin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;
  const input: IoInput<StateQuery> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: {
        $query: {},
      },
    },
  };

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(false);
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('success');

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result).length).toBe(1);

  const users = result[userKey] as Entity<User>[];

  expect(users).toBeDefined();
  /**
   * Initial data has only 3 users.
   * If that changes, change this expectation.
   */
  expect(users.length).toBe(3);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */

test('should login as administrator read user with a depth of 1', async () => {
  const outputLogin = await authenticateFinalize(
    context,
    userAdmin.$id,
    userAdmin.$credentials[0],
  );
  const bearerAccess = outputLogin.json.bearers?.[0] as Bearer;
  const input: IoInput<StateQuery> = {
    accessEncoded: bearerAccess.access,
    body: {
      [userKey]: {
        $query: {},
        $depth: 1,
      },
    },
  };

  const output = await io.read(input, ioOutput());

  expect(output.status).toBe(200);
  expect(ioOutputErrored(output)).toBe(false);

  /**
   * We should receive two success logs from the depth search.
   */
  expect(output.json.logs).toHaveLength(2);
  expect(output.json.logs[0].level).toBe('success');
  expect(output.json.logs[1].level).toBe('success');

  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  expect(Object.keys(result).length).toBe(3);

  const users = result[userKey] as Entity<User>[];
  const roles = result[roleKey] as Entity<Role>[];
  const credentials = result[credentialKey] as Entity<Credential>[];

  expect(users).toBeDefined();
  expect(roles).toBeDefined();
  expect(credentials).toBeDefined();
});
