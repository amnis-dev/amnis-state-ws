import {
  accountsGet,
  AuthLogin,
  AuthLogout,
  base64Encode,
  Challenge,
  challengeEncode,
  challengeKey,
  cryptoWeb,
  IoContext,
  IoInput,
  ioOutput,
  schemaAuth,
  sessionKey,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
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
    body: undefined,
  };
  const outputStart = await authProcessLogin(context)(inputStart, ioOutput());
  const challenge = outputStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  const privateKeyUnwrapped = await cryptoWeb.keyUnwrap(adminAccount.privateKey, 'passwd12');
  const signature = await cryptoWeb.asymSign(
    adminAccount.name + adminAccount.credential.$id + challenge,
    privateKeyUnwrapped,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const inputLogin: IoInput<AuthLogin> = {
    body: {
      username: adminAccount.name,
      password: adminAccount.password,
      challenge: challengeEncode(challenge),
      $credential: adminAccount.credential.$id,
      signature: signatureEncoded,
    },
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
