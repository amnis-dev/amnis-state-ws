import {
  databaseMemoryStorage, Entity, IoContext, User, userKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { findUserById, findUserByName } from './find.js';

let context: IoContext;
let userExisting: Entity<User>;

beforeAll(async () => {
  context = await contextSetup({
    initialize: true,
  });
  userExisting = Object.values(databaseMemoryStorage()[userKey])[0] as Entity<User>;
});

test('should find user by id', async () => {
  const userFound = await findUserById(context, userExisting.$id);

  if (!userFound) {
    expect(userFound).toBeDefined();
    return;
  }
  expect(userFound.$id).toBe(userExisting.$id);
});

test('should find user by name', async () => {
  const userFound = await findUserByName(context, userExisting.name);

  if (!userFound) {
    expect(userFound).toBeDefined();
    return;
  }
  expect(userFound.name).toBe(userExisting.name);
});
