import {
  accountsGet,
  ApiAuthLogin,
  apiAuthLoginCreate,
  ApiAuthLogout,
  Challenge,
  IoContext,
  IoInput,
  ioOutput,
  schemaAuth,
  sessionKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthLogin } from './auth.login.js';
import { processAuthLogout } from './auth.logout.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should login and then logout as administrator', async () => {
  const { admin: adminAccount } = await accountsGet();

  const inputStart: IoInput = {
    body: {},
  };
  const outputStart = await processAuthChallenge(context)(inputStart, ioOutput());
  const challenge = outputStart.json.result as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const authLogin = await apiAuthLoginCreate({
    username: adminAccount.handle,
    password: adminAccount.password,
    challenge,
    credential: adminAccount.credential,
    privateKeyWrapped: adminAccount.privateKey,
  });

  const inputLogin: IoInput<ApiAuthLogin> = {
    body: authLogin,
  };

  const outputLogin = await processAuthLogin(context)(inputLogin, ioOutput());

  expect(outputLogin.status).toBe(200);
  expect(outputLogin.cookies.authSession).toBeDefined();

  const inputLogout: IoInput<ApiAuthLogout> = {
    sessionEncryption: outputLogin.cookies.authSession,
    body: {},
  };

  const outputLogout = await processAuthLogout(context)(inputLogout, ioOutput());

  expect(outputLogout.status).toBe(200);
  expect(Object.keys(outputLogout.json.result || {})).toHaveLength(1);
  expect(outputLogout.json.result?.[sessionKey]).toBeDefined();
  expect(outputLogout.json.result?.[sessionKey]).toHaveLength(1);
  expect(outputLogout.json.result?.[sessionKey][0]).toEqual(expect.any(String));
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should not logout without an existing session', async () => {
  const inputLogout: IoInput<ApiAuthLogout> = {
    body: {},
  };

  const outputLogout = await processAuthLogout(context)(inputLogout, ioOutput());

  expect(outputLogout.status).toBe(401);
});
