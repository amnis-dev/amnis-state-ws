import {
  databaseMemoryStorage,
  Entity,
  IoContext,
  User,
  userKey,
  Credential,
  credentialKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { findCredentialById, findUserByName } from './find.js';

let context: IoContext;
let userExisting: Entity<User>;
let credentialExisting: Entity<Credential>;

beforeAll(async () => {
  context = await contextSetup({
    initialize: true,
  });
  userExisting = Object.values(
    databaseMemoryStorage()[userKey],
  )[0] as Entity<User>;
  credentialExisting = Object.values(
    databaseMemoryStorage()[credentialKey],
  )[0] as Entity<Credential>;
});

test('should find user by name', async () => {
  const found = await findUserByName(context, userExisting.name);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.name).toBe(userExisting.name);
});

test('should find credential by id', async () => {
  const found = await findCredentialById(context, credentialExisting.$id);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.$id).toBe(credentialExisting.$id);
});
