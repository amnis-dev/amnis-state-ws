import {
  accountsGet,
  base64Encode,
  challengeCreator,
  CryptoAsymPrivateKey,
  IoContext,
} from '@amnis/core';
import { challengeActions, contextSetup } from '@amnis/state';
import { authenticateAccount } from './authenticate.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup();
});

test('should authenticate as normal user account', async () => {
  const { user: userAccount } = await accountsGet();

  const challenge = challengeCreator({
    value: await context.crypto.randomString(8),
  });
  context.store.dispatch(challengeActions.create(challenge));

  const privateKey = await context.crypto.keyUnwrap(userAccount.privateKey, userAccount.password);

  if (!privateKey) {
    expect(privateKey).toBeDefined();
    return;
  }

  const signature = await context.crypto.asymSign(
    userAccount.name + userAccount.credential.$id + challenge,
    privateKey as CryptoAsymPrivateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const output = await authenticateAccount(
    context,
    challenge,
    userAccount.name,
    userAccount.credential.$id,
    signatureEncoded,
  );

  console.log(JSON.stringify(output, null, 2));

  expect(output.status).toBe(200);
});

test('should not authenticate with non-existing user', async () => {
  const { user: userAccount } = await accountsGet();

  const challenge = challengeCreator({
    value: await context.crypto.randomString(8),
  });
  context.store.dispatch(challengeActions.create(challenge));

  const username = 'i-dont-exist';
  const asymKeys = await context.crypto.asymGenerate('signer');
  const signature = await context.crypto.asymSign(username + challenge, asymKeys.privateKey);
  const output = await authenticateAccount(
    context,
    challenge,
    username,
    userAccount.credential.$id,
    signature,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Authentication Failed: User Not Found');
});

test('should not authenticate using different credentials', async () => {
  const { user: userAccount, exec: execAccount } = await accountsGet();

  const challenge = challengeCreator({
    value: await context.crypto.randomString(8),
  });
  context.store.dispatch(challengeActions.create(challenge));

  const privateKey = await context.crypto.keyUnwrap(userAccount.privateKey, userAccount.password);

  if (!privateKey) {
    expect(privateKey).toBeDefined();
    return;
  }

  const signature = await context.crypto.asymSign(
    userAccount.name + userAccount.credential.$id + challenge,
    privateKey as CryptoAsymPrivateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const output = await authenticateAccount(
    context,
    challenge,
    userAccount.name,
    execAccount.credential.$id,
    signatureEncoded,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Authentication Failed: Unlinked Credential');
});

test('should not authenticate using different private key for signing', async () => {
  const { user: userAccount, exec: execAccount } = await accountsGet();

  const challenge = challengeCreator({
    value: await context.crypto.randomString(8),
  });
  context.store.dispatch(challengeActions.create(challenge));

  const privateKey = await context.crypto.keyUnwrap(execAccount.privateKey, execAccount.password);

  if (!privateKey) {
    expect(privateKey).toBeDefined();
    return;
  }

  const signature = await context.crypto.asymSign(
    userAccount.name + userAccount.credential.$id + challenge,
    privateKey as CryptoAsymPrivateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const output = await authenticateAccount(
    context,
    challenge,
    userAccount.name,
    userAccount.credential.$id,
    signatureEncoded,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Authentication Failed: Improper Attestation');
});
