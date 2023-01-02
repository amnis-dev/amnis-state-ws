import {
  accountsGet,
  agentFingerprint,
  ApiAuthChallenge,
  base64Encode,
  databaseMemoryStorage,
  dateNumeric,
  Entity,
  IoContext,
  IoInput,
  ioOutput,
  schemaAuth,
  sendMailboxClear,
  sendMailboxStorage,
  sessionCreator,
  User,
  userKey,
} from '@amnis/core';
import {
  challengeSelectors,
  contextSetup,
} from '@amnis/state';
import { validateSetup } from '../validate.js';
import { processAuthChallenge } from './auth.challenge.js';

let context: IoContext;
let adminUser: Entity<User>;
let adminSessionEncryption: string;
let userUser: Entity<User>;
let userSessionEncryption: string;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
  const storage = databaseMemoryStorage();
  const storageUsers = Object.values(storage[userKey]) as Entity<User>[];

  adminUser = storageUsers.find((u) => u.handle === 'admin') as Entity<User>;
  userUser = storageUsers.find((u) => u.handle === 'user') as Entity<User>;

  const { user, admin } = await accountsGet();
  /**
   * Generate sessions to use.
   */
  adminSessionEncryption = await context.crypto.sessionEncrypt(
    sessionCreator({
      $subject: adminUser.$id,
      $credential: admin.credential.$id,
      exp: dateNumeric('30m'),
      prv: true,
      adm: true,
    }),
  );
  userSessionEncryption = await context.crypto.sessionEncrypt(
    sessionCreator({
      $subject: adminUser.$id,
      $credential: user.credential.$id,
      exp: dateNumeric('30m'),
    }),
  );
});

afterEach(() => {
  sendMailboxClear();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should generate a challenge entity', async () => {
  const input: IoInput<ApiAuthChallenge> = {
    body: {},
  };
  const output = await processAuthChallenge(context)(input, ioOutput());
  const challenge = output.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  expect(challenge).toMatchObject({
    val: expect.any(String),
  });
  expect(challenge.$sub).toBeUndefined();
  expect(challenge.otp).toBeUndefined();

  /**
   * Check the challenge on the context store.
   */
  const state = context.store.getState();
  const ioChallenge = challengeSelectors.selectById(state, challenge.$id);

  if (!ioChallenge) {
    expect(ioChallenge).toBeDefined();
    return;
  }

  expect(ioChallenge).toMatchObject({
    val: expect.any(String),
  });
  expect(ioChallenge.$sub).toBeUndefined();
  expect(ioChallenge.otp).toBeUndefined();
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should generate a challenge entity with a subject', async () => {
  const input: IoInput<ApiAuthChallenge> = {
    body: {
      subject: userUser.$id,
    },
  };
  const output = await processAuthChallenge(context)(input, ioOutput());
  const challenge = output.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  expect(challenge).toMatchObject({
    val: expect.any(String),
  });
  expect(challenge.$sub).toBe(userUser.$id);
  expect(challenge.otp).toBeUndefined();

  /**
   * Check the challenge on the context store.
   */
  const state = context.store.getState();
  const ioChallenge = challengeSelectors.selectById(state, challenge.$id);

  if (!ioChallenge) {
    expect(ioChallenge).toBeDefined();
    return;
  }

  expect(ioChallenge).toMatchObject({
    val: expect.any(String),
  });
  expect(ioChallenge.$sub).toBe(userUser.$id);
  expect(ioChallenge.otp).toEqual(expect.any(String));
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should generate a challenge entity with a subject and send the OTP via email', async () => {
  const email = userUser.email as string;
  const input: IoInput<ApiAuthChallenge> = {
    body: {
      subject: userUser.$id,
      email,
    },
  };
  const output = await processAuthChallenge(context)(input, ioOutput());
  const challenge = output.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  expect(challenge).toMatchObject({
    val: expect.any(String),
  });
  expect(challenge.$sub).toBe(userUser.$id);
  expect(challenge.otp).toBeUndefined();

  /**
   * Check the challenge on the context store.
   */
  const state = context.store.getState();
  const ioChallenge = challengeSelectors.selectById(state, challenge.$id);

  if (!ioChallenge) {
    expect(ioChallenge).toBeDefined();
    return;
  }

  expect(ioChallenge).toMatchObject({
    val: expect.any(String),
  });
  expect(ioChallenge.$sub).toBe(userUser.$id);
  expect(ioChallenge.otp).toEqual(expect.any(String));

  /**
   * Get the OTP from the "email".
   */
  const mailboxes = sendMailboxStorage();
  const message = mailboxes[email][0];
  const messageOtp = message.text.match(/"([A-Za-z0-9]+)"/)?.[1];

  if (!messageOtp) {
    expect(messageOtp).toBeDefined();
    return;
  }

  /**
   * Ensure the OTP matches to IO challenge.
   */
  expect(messageOtp).toBe(ioChallenge.otp);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should generate a challenge entity with a subject and NOT send the OTP to a mismatched email', async () => {
  const email = adminUser.email as string;
  const input: IoInput<ApiAuthChallenge> = {
    body: {
      subject: userUser.$id,
      email,
    },
  };
  const output = await processAuthChallenge(context)(input, ioOutput());
  const challenge = output.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  expect(challenge).toMatchObject({
    val: expect.any(String),
  });
  expect(challenge.$sub).toBe(userUser.$id);
  expect(challenge.otp).toBeUndefined();

  /**
   * Check the challenge on the context store.
   */
  const state = context.store.getState();
  const ioChallenge = challengeSelectors.selectById(state, challenge.$id);

  if (!ioChallenge) {
    expect(ioChallenge).toBeDefined();
    return;
  }

  expect(ioChallenge).toMatchObject({
    val: expect.any(String),
  });
  expect(ioChallenge.$sub).toBe(userUser.$id);
  expect(ioChallenge.otp).toEqual(expect.any(String));

  /**
   * Ensure no "email" was sent.
   */
  const mailboxes = sendMailboxStorage();
  expect(Object.keys(mailboxes)).toHaveLength(0);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should generate a challenge entity with a subject as an administrator to return an OTP', async () => {
  /**
   * sign the subject.
   */
  const { admin } = await accountsGet();
  const privateKey = await context.crypto.keyUnwrap(
    admin.privateKey,
    await context.crypto.hashData(agentFingerprint()),
  );
  const signature = await context.crypto.asymSign(userUser.$id, privateKey);

  const input: IoInput<ApiAuthChallenge> = {
    body: {
      subject: userUser.$id,
      signature: base64Encode(new Uint8Array(signature)),
    },
    sessionEncrypted: adminSessionEncryption,
  };
  const output = await processAuthChallenge(context)(input, ioOutput());
  const challenge = output.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  expect(challenge).toMatchObject({
    val: expect.any(String),
  });
  expect(challenge.$sub).toBe(userUser.$id);
  expect(challenge.otp).toEqual(expect.any(String));

  /**
   * Check the challenge on the context store.
   */
  const state = context.store.getState();
  const ioChallenge = challengeSelectors.selectById(state, challenge.$id);

  if (!ioChallenge) {
    expect(ioChallenge).toBeDefined();
    return;
  }

  expect(ioChallenge).toMatchObject({
    val: expect.any(String),
  });
  expect(ioChallenge.$sub).toBe(userUser.$id);
  expect(ioChallenge.otp).toEqual(challenge.otp);
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * ================================================================================================
 */
test('should generate a challenge entity with a subject as a user NOT return an OTP', async () => {
  /**
   * sign the subject.
   */
  const { admin } = await accountsGet();
  const privateKey = await context.crypto.keyUnwrap(
    admin.privateKey,
    await context.crypto.hashData(agentFingerprint()),
  );
  const signature = await context.crypto.asymSign(userUser.$id, privateKey);

  const input: IoInput<ApiAuthChallenge> = {
    body: {
      subject: userUser.$id,
      signature: base64Encode(new Uint8Array(signature)),
    },
    sessionEncrypted: userSessionEncryption,
  };
  const output = await processAuthChallenge(context)(input, ioOutput());
  const challenge = output.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  expect(challenge).toMatchObject({
    val: expect.any(String),
  });
  expect(challenge.$sub).toBe(userUser.$id);
  expect(challenge.otp).toBeUndefined();

  /**
   * Check the challenge on the context store.
   */
  const state = context.store.getState();
  const ioChallenge = challengeSelectors.selectById(state, challenge.$id);

  if (!ioChallenge) {
    expect(ioChallenge).toBeDefined();
    return;
  }

  expect(ioChallenge).toMatchObject({
    val: expect.any(String),
  });
  expect(ioChallenge.$sub).toBe(userUser.$id);
  expect(ioChallenge.otp).toEqual(expect.any(String));
});
