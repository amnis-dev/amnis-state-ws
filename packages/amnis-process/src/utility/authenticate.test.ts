import {
  accountsGet,
  base64Encode,
  challengeCreator,
  cryptoWeb,
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
    privateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const output = await authenticateAccount(
    context,
    challenge,
    userAccount.name,
    userAccount.credential.$id,
    signatureEncoded,
  );

  expect(output.status).toBe(200);
  expect(output.cookies.authSession).toBeDefined();
  expect(output.cookies.authSession).toEqual(expect.any(String));
  expect(output.json.bearers).toBeDefined();
  expect(output.json.bearers).toHaveLength(1);
  expect(output.json.bearers?.[0]).toMatchObject({
    id: 'core',
    exp: expect.any(Number),
    access: expect.any(String),
  });

  const {
    user: users,
    profile: profiles,
    contact: contacts,
    session: sessions,
  } = output.json.result;

  expect(users).toBeDefined();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    name: 'user',
    $credentials: [
      userAccount.credential.$id,
    ],
  });

  expect(profiles).toBeDefined();
  expect(profiles).toHaveLength(1);
  expect(profiles[0]).toMatchObject({
    $user: users[0].$id,
  });

  expect(contacts).toBeDefined();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({
    $id: profiles[0].$contact,
  });

  expect(sessions).toBeDefined();
  expect(sessions).toHaveLength(1);
  expect(sessions[0]).toMatchObject({
    $subject: users[0].$id,
  });
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

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const output = await authenticateAccount(
    context,
    challenge,
    username,
    userAccount.credential.$id,
    signatureEncoded,
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
    privateKey,
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
  expect(output.json.logs[0].title).toBe('Authentication Failed: Invalid Credential');
});

test('should not authenticate using a different private key for signing', async () => {
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
    privateKey,
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

test('should not authenticate using a different challenge value', async () => {
  const { user: userAccount, exec: execAccount } = await accountsGet();

  const challenge = challengeCreator({
    value: await context.crypto.randomString(8),
  });
  context.store.dispatch(challengeActions.create(challenge));
  const challengeChanged = {
    ...challenge,
    value: await cryptoWeb.randomString(32),
  };

  const privateKey = await context.crypto.keyUnwrap(execAccount.privateKey, execAccount.password);

  if (!privateKey) {
    expect(privateKey).toBeDefined();
    return;
  }

  const signature = await context.crypto.asymSign(
    userAccount.name + userAccount.credential.$id + challenge,
    privateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const output = await authenticateAccount(
    context,
    challengeChanged,
    userAccount.name,
    userAccount.credential.$id,
    signatureEncoded,
  );

  expect(output.status).toBe(500);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Invalid Challenge Code');
});

test('should not authenticate using different credentials but valid password', async () => {
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
    privateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const output = await authenticateAccount(
    context,
    challenge,
    userAccount.name,
    execAccount.credential.$id,
    signatureEncoded,
    userAccount.password,
  );

  expect(output.status).toBe(401);
  expect(output.json.result).toBeUndefined();
  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].level).toBe('error');
  expect(output.json.logs[0].title).toBe('Unknown Device');
});
