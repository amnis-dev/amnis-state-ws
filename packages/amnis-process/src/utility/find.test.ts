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
  Role,
  roleKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import {
  findContactById, findCredentialById, findProfileByUserId, findRolesByIds, findUserByHandle,
} from './find.js';

let context: IoContext;
let userExisting: Entity<User>;
let profileExisting: Entity<Profile>;
let credentialExisting: Entity<Credential>;
let contactExisting: Entity<Contact>;
let rolesExisting: Entity<Role>[];

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

  rolesExisting = Object.values(
    databaseMemoryStorage()[roleKey],
  ) as Entity<Role>[];
});

test('should find user by handle', async () => {
  const found = await findUserByHandle(context, userExisting.handle);

  if (!found) {
    expect(found).toBeDefined();
    return;
  }
  expect(found.handle).toBe(userExisting.handle);
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

test('should find roles by ids', async () => {
  const roleIds = rolesExisting.map((role) => role.$id);
  const found = await findRolesByIds(context, roleIds);

  expect(roleIds.length).toBeGreaterThan(0);
  expect(roleIds.length).toBe(found.length);
  expect(found).toEqual(rolesExisting);
});
