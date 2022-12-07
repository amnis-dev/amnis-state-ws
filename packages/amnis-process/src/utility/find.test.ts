import {
  databaseMemoryStorage,
  Entity,
  IoContext,
  User,
  userKey,
  Credential,
  credentialKey,
  Contact,
  contactKey,
  Profile,
  profileKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import {
  findContactById, findCredentialById, findProfileByUserId, findUserByName,
} from './find.js';

let context: IoContext;
let userExisting: Entity<User>;
let profileExisting: Entity<Profile>;
let credentialExisting: Entity<Credential>;
let contactExisting: Entity<Contact>;

beforeAll(async () => {
  context = await contextSetup({
    initialize: true,
  });

  userExisting = Object.values(
    databaseMemoryStorage()[userKey],
  )[0] as Entity<User>;

  profileExisting = Object.values(
    databaseMemoryStorage()[profileKey],
  )[0] as Entity<Profile>;

  credentialExisting = Object.values(
    databaseMemoryStorage()[credentialKey],
  )[0] as Entity<Credential>;

  contactExisting = Object.values(
    databaseMemoryStorage()[contactKey],
  )[0] as Entity<Contact>;
});

test('should find user by name', async () => {
  const found = await findUserByName(context, userExisting.name);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.name).toBe(userExisting.name);
});

test('should find profile by user id', async () => {
  const found = await findProfileByUserId(context, profileExisting.$user);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.$id).toBe(profileExisting.$id);
});

test('should find credential by id', async () => {
  const found = await findCredentialById(context, credentialExisting.$id);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.$id).toBe(credentialExisting.$id);
});

test('should find contact by id', async () => {
  const found = await findContactById(context, contactExisting.$id);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.$id).toBe(contactExisting.$id);
});
