import {
  accountsGet,
  AuthLogin,
  authLoginCreate,
  AuthLogout,
  Challenge,
  IoContext,
  IoInput,
  ioOutput,
  schemaAuth,
  sessionKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessChallenge } from './auth.challenge.js';
import { authProcessLogin } from './auth.login.js';
import { authProcessLogout } from './auth.logout.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
});

test('should login and then logout as administrator', async () => {
  const { admin: adminAccount } = await accountsGet();

  const inputStart: IoInput = {
    body: {},
  };
  const outputStart = await authProcessChallenge(context)(inputStart, ioOutput());
  const challenge = outputStart.json.result as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const authLogin = await authLoginCreate({
    username: adminAccount.name,
    password: adminAccount.password,
    challenge,
    credential: adminAccount.credential,
    privateKeyWrapped: adminAccount.privateKey,
  });

  const inputLogin: IoInput<AuthLogin> = {
    body: authLogin,
  };

  const outputLogin = await authProcessLogin(context)(inputLogin, ioOutput());

  expect(outputLogin.status).toBe(200);
  expect(outputLogin.cookies.authSession).toBeDefined();

  const inputLogout: IoInput<AuthLogout> = {
    sessionEncryption: outputLogin.cookies.authSession,
    body: {},
  };

  const outputLogout = await authProcessLogout(context)(inputLogout, ioOutput());

  expect(outputLogout.status).toBe(200);
  expect(Object.keys(outputLogout.json.result)).toHaveLength(1);
  expect(outputLogout.json.result?.[sessionKey]).toBeDefined();
  expect(outputLogout.json.result?.[sessionKey]).toHaveLength(1);
  expect(outputLogout.json.result?.[sessionKey][0]).toEqual(expect.any(String));
});

test('should not logout without an existing session', async () => {
  const inputLogout: IoInput<AuthLogout> = {
    body: {},
  };

  const outputLogout = await authProcessLogout(context)(inputLogout, ioOutput());

  expect(outputLogout.status).toBe(401);
});
