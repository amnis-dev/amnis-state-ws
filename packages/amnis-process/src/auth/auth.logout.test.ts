import {
  accountsGet,
  accountsSign,
  ApiAuthLogin,
  ApiAuthLogout,
  base64JsonEncode,
  Challenge,
  IoContext,
  IoInput,
  ioOutput,
  schemaAuth,
  sessionKey,
  System,
} from '@amnis/core';
import { contextSetup, systemSelectors } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthLogin } from './auth.login.js';
import { processAuthLogout } from './auth.logout.js';

let context: IoContext;
let system: System;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });

  system = systemSelectors.selectActive(context.store.getState()) as System;
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

  const challengeEncoded = base64JsonEncode(challenge);

  const apiAuthLogin: ApiAuthLogin = {
    handle: adminAccount.handle,
    $credential: adminAccount.credential.$id,
    password: adminAccount.password,
  };

  const signatureEncoded = await accountsSign(adminAccount.privateKey, apiAuthLogin);

  const inputLogin: IoInput<ApiAuthLogin> = {
    body: apiAuthLogin,
    challengeEncoded,
    signatureEncoded,
  };

  const outputLogin = await processAuthLogin(context)(inputLogin, ioOutput());

  expect(outputLogin.status).toBe(200);
  expect(outputLogin.cookies[system.sessionKey]).toBeDefined();

  const inputLogout: IoInput<ApiAuthLogout> = {
    sessionEncrypted: outputLogin.cookies[system.sessionKey],
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
