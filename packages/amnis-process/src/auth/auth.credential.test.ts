import {
  base64Encode,
  base64JsonEncode,
  credentialCreator,
  databaseMemoryStorage,
  Entity,
  IoContext,
  schemaAuth,
  User,
  userKey,
  Credential,
  IoInput,
  ApiAuthCredential,
  ioOutput,
  accountsGet,
} from '@amnis/core';
import { contextSetup, otpSelectors } from '@amnis/state';
import { challengeNew } from '../utility/challenge.js';
import { otpNew, otpPasswordCreate } from '../utility/otp.js';
import { validateSetup } from '../validate.js';
import { processAuthCredential } from './auth.credential.js';

let context: IoContext;
let credentialNew: Credential;
let credentialNewPrivateKey: CryptoKey;
let userUser: Entity<User>;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });

  /**
   * Create a new credentials
   */
  const credentialKeys = await context.crypto.asymGenerate('signer');
  credentialNewPrivateKey = credentialKeys.privateKey;
  credentialNew = credentialCreator({
    name: 'New Credential',
    publicKey: await context.crypto.keyExport(credentialKeys.publicKey),
  });

  const storage = databaseMemoryStorage();
  const storageUsers = Object.values(storage[userKey]) as Entity<User>[];

  userUser = storageUsers.find((u) => u.handle === 'user') as Entity<User>;
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should add a new credential to the user account', async () => {
  const { user } = await accountsGet();
  /**
   * Create a subject challenge.
   */
  const challengeOutput = await challengeNew(context);
  const challenge = challengeOutput.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Create an OTP for this process.
   */
  const otpOutput = await otpNew(context, {
    $subject: userUser.$id,
  });
  const otp = otpOutput.json.result;
  if (!otp) {
    expect(otp).toBeDefined();
    return;
  }
  expect(otp.val).toBeUndefined();
  const otpServer = otpSelectors.selectById(context.store.getState(), otp.$id);
  const otpEncoded = base64JsonEncode({ ...otp, val: otpServer?.val });

  const apiAuthCredential: ApiAuthCredential = {
    credential: credentialNew,
    password: user.password,
  };

  /**
   * Use the private key to sign the new credential.
   */
  const signature = await context.crypto.asymSign(
    JSON.stringify(apiAuthCredential),
    credentialNewPrivateKey,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  /**
   * Process the new credential creation.
   */
  const input: IoInput<ApiAuthCredential> = {
    body: apiAuthCredential,
    challengeEncoded,
    signatureEncoded,
    otpEncoded,
  };
  const output = await processAuthCredential(context)(input, ioOutput());

  /**
   * The output should provide the credential and the updated user entity.
   */
  expect(output.status).toBe(200);
  const { result } = output.json;

  if (!result) {
    expect(result).toBeDefined();
    return;
  }

  const { user: users, credential: credentials } = result;
  const userEntity = users[0] as Entity<User>;
  const credentialEntity = credentials[0] as Entity<Credential>;

  expect(userEntity.$credentials).toHaveLength(2);
  expect(userEntity.$credentials.includes(credentialNew.$id)).toBe(true);
  expect(credentialEntity.$id).toBe(credentialNew.$id);
  expect(credentialEntity.publicKey).toBe(credentialNew.publicKey);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should NOT add a new credential without a challenge object', async () => {
  const { user } = await accountsGet();
  /**
   * Create an OTP for this process.
   */
  const otpOutput = await otpNew(context, {
    $subject: userUser.$id,
  });
  const otp = otpOutput.json.result;
  if (!otp) {
    expect(otp).toBeDefined();
    return;
  }
  expect(otp.val).toBeUndefined();
  const otpServer = otpSelectors.selectById(context.store.getState(), otp.$id);
  const otpEncoded = base64JsonEncode({ ...otp, val: otpServer?.val });

  const apiAuthCredential: ApiAuthCredential = {
    credential: credentialNew,
    password: user.password,
  };

  /**
   * Use the private key to sign the new credential.
   */
  const signature = await context.crypto.asymSign(
    JSON.stringify(apiAuthCredential),
    credentialNewPrivateKey,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  /**
   * Process the new credential creation.
   */
  const input: IoInput<ApiAuthCredential> = {
    body: apiAuthCredential,
    signatureEncoded,
    otpEncoded,
  };
  const output = await processAuthCredential(context)(input, ioOutput());

  expect(output.status).toBe(401);
  const { logs } = output.json;

  expect(logs[0].title).toBe('Missing Challenge');
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should NOT add a new credential to the user account without an OTP', async () => {
  const { user } = await accountsGet();
  /**
   * Create a subject challenge.
   */
  const challengeOutput = await challengeNew(context);
  const challenge = challengeOutput.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  const apiAuthCredential: ApiAuthCredential = {
    credential: credentialNew,
    password: user.password,
  };

  /**
   * Use the private key to sign the new credential.
   */
  const signature = await context.crypto.asymSign(
    JSON.stringify(apiAuthCredential),
    credentialNewPrivateKey,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  /**
   * Process the new credential creation.
   */
  const input: IoInput<ApiAuthCredential> = {
    body: apiAuthCredential,
    challengeEncoded,
    signatureEncoded,
  };
  const output = await processAuthCredential(context)(input, ioOutput());

  expect(output.status).toBe(401);
  const { logs } = output.json;

  expect(logs[0].title).toBe('Missing One-Time Password');
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should NOT add a new credential to the user account with invalid OTP value', async () => {
  const { user } = await accountsGet();
  /**
   * Create a subject challenge.
   */
  const challengeOutput = await challengeNew(context);
  const challenge = challengeOutput.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  /**
   * Create an OTP for this process.
   */
  const otpOutput = await otpNew(context, {
    $subject: userUser.$id,
  });
  const otp = otpOutput.json.result;
  if (!otp) {
    expect(otp).toBeDefined();
    return;
  }
  expect(otp.val).toBeUndefined();
  const otpEncoded = base64JsonEncode({ ...otp, val: await otpPasswordCreate(context, 12) });

  const apiAuthCredential: ApiAuthCredential = {
    credential: credentialNew,
    password: user.password,
  };

  /**
   * Use the private key to sign the new credential.
   */
  const signature = await context.crypto.asymSign(
    JSON.stringify(apiAuthCredential),
    credentialNewPrivateKey,
  );
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  /**
   * Process the new credential creation.
   */
  const input: IoInput<ApiAuthCredential> = {
    body: apiAuthCredential,
    challengeEncoded,
    signatureEncoded,
    otpEncoded,
  };
  const output = await processAuthCredential(context)(input, ioOutput());

  expect(output.status).toBe(401);
  const { logs } = output.json;

  expect(logs[0].title).toBe('Invalid One-Time Password');
});
