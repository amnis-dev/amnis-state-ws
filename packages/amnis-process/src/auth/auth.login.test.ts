import {
  schemaAuth,
  IoContext,
  accountsGet,
  IoInput,
  AuthLogin,
  StateEntities,
  challengeKey,
  Challenge,
  challengeEncode,
  cryptoWeb,
  base64Encode,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { authProcessLogin } from './auth.login.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
});

test('should start the login ritual', async () => {
  const input: IoInput = {
    body: undefined,
  };

  const output = await authProcessLogin(context)(input);

  expect(output.status).toBe(200);

  if (!output.json.result) {
    expect(output.json.result).toBeDefined();
    return;
  }

  const stateEntities = output.json.result as StateEntities;

  expect(Object.keys(stateEntities)).toHaveLength(1);
  expect(stateEntities).toMatchObject({
    [challengeKey]: expect.any(Array),
  });
});

test('must be able to login as a user', async () => {
  const { user: userAccount } = await accountsGet();

  const inputStart: IoInput = {
    body: undefined,
  };
  const outputStart = await authProcessLogin(context)(inputStart);
  const challenge = outputStart.json.result?.[challengeKey]?.[0] as Challenge | undefined;

  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  console.log({ challenge });

  const privateKeyUnwrapped = await cryptoWeb.keyUnwrap(userAccount.privateKey, 'passwd12');
  const signature = await cryptoWeb.asymSign(
    userAccount.name + userAccount.credential.$id + challenge,
    privateKeyUnwrapped,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const input: IoInput<AuthLogin> = {
    body: {
      username: userAccount.name,
      challenge: challengeEncode(challenge),
      $credential: userAccount.credential.$id,
      signature: signatureEncoded,
    },
  };

  const output = await authProcessLogin(context)(input);

  console.log(JSON.stringify({ input, output }, null, 2));
});
