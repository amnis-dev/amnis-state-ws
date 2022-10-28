import { memory } from '@amnis/db';
import {
  AuthLogin,
  dataInitial,
  IoInput,
  ioProcess,
  Profile,
  profileKey,
  schemaAuth,
  sessionKey,
  User,
  userKey,
} from '@amnis/core';
import { storeSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessLogin } from './auth.login.js';

const io = ioProcess(
  {
    store: storeSetup(),
    validators: validateSetup([schemaAuth]),
    database: memory,
  },
  {
    login: authProcessLogin,
  },
);

beforeAll(async () => {
  await memory.create(dataInitial());
});

test('should login as administrator', async () => {
  const input: IoInput<AuthLogin> = {
    body: {
      username: 'admin',
      password: 'passwd12',
    },
  };

  const output = await io.login(input);

  expect(output.status).toBe(200);
  expect(output.cookies?.authSession).toBeDefined();
  expect(output.json.tokens).toHaveLength(1);
  expect(output.json.result?.[userKey]).toHaveLength(1);
  expect(output.json.result?.[profileKey]).toHaveLength(1);
  expect(output.json.result?.[sessionKey]).toHaveLength(1);

  const user = output.json.result?.[userKey][0] as User;
  const profile = output.json.result?.[profileKey][0] as Profile;

  expect(user.name).toBe('admin');
  expect(profile.nameDisplay).toBe('Administrator');
});

test('should not login as administrator with incorrect credentials', async () => {
  const input: IoInput<AuthLogin> = {
    body: {
      username: 'admin',
      password: '21dwssap',
    },
  };

  const output = await io.login(input);

  expect(output.status).toBe(401);
  expect(Object.keys(output.cookies)).toHaveLength(0);
  expect(output.json.logs).toHaveLength(1);
});

test('should login as executive', async () => {
  const input: IoInput<AuthLogin> = {
    body: {
      username: 'exec',
      password: 'passwd12',
    },
  };

  const output = await io.login(input);

  expect(output.status).toBe(200);
  expect(output.cookies?.authSession).toBeDefined();
  expect(output.json.tokens).toHaveLength(1);
  expect(output.json.result?.[userKey]).toHaveLength(1);
  expect(output.json.result?.[profileKey]).toHaveLength(1);
  expect(output.json.result?.[sessionKey]).toHaveLength(1);

  const user = output.json.result?.[userKey][0] as User;
  const profile = output.json.result?.[profileKey][0] as Profile;

  expect(user.name).toBe('exec');
  expect(profile.nameDisplay).toBe('Executive');
});

test('should not login as executive with incorrect credentials', async () => {
  const input: IoInput<AuthLogin> = {
    body: {
      username: 'exec',
      password: '21dwssap',
    },
  };

  const output = await io.login(input);

  expect(output.status).toBe(401);
  expect(Object.keys(output.cookies)).toHaveLength(0);
  expect(output.json.logs).toHaveLength(1);
});

test('should login as user', async () => {
  const input: IoInput<AuthLogin> = {
    body: {
      username: 'user',
      password: 'passwd12',
    },
  };

  const output = await io.login(input);

  expect(output.status).toBe(200);
  expect(output.cookies?.authSession).toBeDefined();
  expect(output.json.tokens).toHaveLength(1);
  expect(output.json.result?.[userKey]).toHaveLength(1);
  expect(output.json.result?.[profileKey]).toHaveLength(1);
  expect(output.json.result?.[sessionKey]).toHaveLength(1);

  const user = output.json.result?.[userKey][0] as User;
  const profile = output.json.result?.[profileKey][0] as Profile;

  expect(user.name).toBe('user');
  expect(profile.nameDisplay).toBe('User');
});

test('should not login as user with incorrect credentials', async () => {
  const input: IoInput<AuthLogin> = {
    body: {
      username: 'user',
      password: '21dwssap',
    },
  };

  const output = await io.login(input);

  expect(output.status).toBe(401);
  expect(Object.keys(output.cookies)).toHaveLength(0);
  expect(output.json.logs).toHaveLength(1);
});
