import {
  credentialKey,
  databaseMemoryStorage,
  dateNumeric,
  Entity,
  IoContext,
  uid,
  User,
  userKey,
} from '@amnis/core';
import { contextSetup, systemSelectors } from '@amnis/state';
import { generateBearer, generateSession } from './generate.js';

let context: IoContext;

let userExisting: Entity<User>;

beforeAll(async () => {
  context = await contextSetup();

  userExisting = Object.values(
    databaseMemoryStorage()[userKey],
  )[0] as Entity<User>;
});

test('should generate a session', async () => {
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    expect(system).toBeDefined();
    return;
  }

  const session = await generateSession(system, userExisting.$id, uid(credentialKey));

  expect(session).toMatchObject({
    $id: expect.any(String),
    $subject: expect.any(String),
    $credential: expect.any(String),
    exp: expect.any(Number),
  });
});

test('should generate a bearer', async () => {
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    expect(system).toBeDefined();
    return;
  }

  const bearer = await generateBearer(context, system, userExisting.$id, userExisting.$roles);
  const now = dateNumeric();
  const tolerance = 5000; // five seconds.
  const time = 1800000 - tolerance; // 30 minutes - tolerance.

  expect(bearer).toMatchObject({
    id: 'core',
    exp: expect.any(Number),
    access: expect.any(String),
  });

  /**
   * Ensure the bearer reads that it'll last about 30 minutes (+/- 5 seconds).
   */
  expect(bearer.exp - now).toBeGreaterThanOrEqual(time);

  /**
   * Ensure the actual access token will last about 30 minutes (+/- 5 seconds).
   */
  const verified = await context.crypto.accessVerify(bearer.access);
  if (!verified) {
    expect(verified).toBeDefined();
    return;
  }

  expect(verified.exp - now).toBeGreaterThanOrEqual(time);
});
