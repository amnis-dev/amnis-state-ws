import {
  databaseMemoryStorage,
  dateNumeric,
  Entity,
  IoContext,
  Profile,
  profileKey,
  User,
  userKey,
} from '@amnis/core';
import { contextSetup, systemSelectors } from '@amnis/state';
import { generateBearer, generateSession } from './generate.js';

let context: IoContext;

let userExisting: Entity<User>;
let profileExisting: Entity<Profile>;

beforeAll(async () => {
  context = await contextSetup();

  userExisting = Object.values(
    databaseMemoryStorage()[userKey],
  )[0] as Entity<User>;

  profileExisting = Object.values(
    databaseMemoryStorage()[profileKey],
  )[0] as Entity<Profile>;
});

test('should generate a session', async () => {
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    expect(system).toBeDefined();
    return;
  }

  const session = await generateSession(system, userExisting, profileExisting);

  expect(session).toMatchObject({
    $subject: expect.any(String),
    exp: expect.any(Number),
    name: expect.any(String),
    $id: expect.any(String),
  });
});

test('should generate a bearer', async () => {
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    expect(system).toBeDefined();
    return;
  }

  const bearer = await generateBearer(context, system, userExisting);
  const now = dateNumeric();
  const tolerance = 1000; // one second.
  const time = 1800000 - tolerance; // 30 minutes - tolerance.

  expect(bearer).toMatchObject({
    id: 'core',
    exp: expect.any(Number),
    access: expect.any(String),
  });

  /**
   * Ensure the bearer reads that it'll last about 30 minutes (+/- 1 second).
   */
  expect(bearer.exp - now).toBeGreaterThanOrEqual(time);

  /**
   * Ensure the actual access token will last about 30 minutes (+/- 1 second).
   */
  const verified = await context.crypto.accessVerify(bearer.access);
  if (!verified) {
    expect(verified).toBeDefined();
    return;
  }

  expect(verified.exp - now).toBeGreaterThanOrEqual(time);
});
