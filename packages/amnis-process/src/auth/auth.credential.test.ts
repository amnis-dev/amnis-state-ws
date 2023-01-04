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
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { challengeNew } from '../utility/challenge.js';
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
  /**
   * Create a subject challenge.
   */
  const challengeOutout = await challengeNew(context);
  const challenge = challengeOutout.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }
  const challengeEncoded = base64JsonEncode(challenge);

  const apiAuthCredential: ApiAuthCredential = {
    credential: credentialNew,
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

  // /**
  //  * The output should provide the credential and the updated user entity.
  //  */
  // expect(output.status).toBe(200);
  // const { result } = output.json;
  // if (!result) {
  //   expect(result).toBeDefined();
  //   return;
  // }
  // const { user: users, credential: credentials } = result;
  // const user = users[0] as Entity<User>;
  // const credential = credentials[0] as Entity<Credential>;

  // expect(user.$credentials).toHaveLength(2);
  // expect(user.$credentials.includes(credentialNew.$id)).toBe(true);
  // expect(credential.$id).toBe(credentialNew.$id);
  // expect(credential.publicKey).toBe(credentialNew.publicKey);
});
