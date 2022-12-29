import {
  accountsGet,
  ApiAuthCreate,
  apiAuthCreateCreate,
  IoContext,
  IoInput,
  ioOutput,
  schemaAuth,
  uid,
} from '@amnis/core';
import { contextSetup, systemSelectors } from '@amnis/state';
import { generateSession } from '../utility/generate.js';
import { validateSetup } from '../validate.js';
import { processAuthChallenge } from './auth.challenge.js';
import { processAuthCreate } from './auth.create.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaAuth]),
  });
});

test('should create a new account as an admin', async () => {
  const { admin } = await accountsGet();

  /**
   * Create an administrative session with the admin public key.
   */
  const system = systemSelectors.selectActive(context.store.getState());
  if (!system) {
    expect(system).toBeDefined();
    return;
  }
  const session = await generateSession(system, uid('user'), admin.credential.publicKey);
  const sessionEncrypted = await context.crypto.sessionEncrypt(session);

  /**
   * Get a challenge.
   */
  const outputChallenge = await processAuthChallenge(context)({ body: {} }, ioOutput());

  const challenge = outputChallenge.json.result;
  if (!challenge) {
    expect(challenge).toBeDefined();
    return;
  }

  /**
   * Prepare the create request.
   */
  const apiAuthCreateOptions = {
    handle: 'new-user',
    password: 'passwd12',
    email: 'account@email.addr',
    nameDisplay: 'New User',
  };
  const apiAuthCreate = await apiAuthCreateCreate({
    challenge,
    privateKeyWrapped: admin.privateKey,
    ...apiAuthCreateOptions,
  });

  const input: IoInput<ApiAuthCreate> = {
    body: apiAuthCreate,
    sessionEncrypted,
  };
  const output = await processAuthCreate(context)(input, ioOutput());

  console.log(JSON.stringify(output, null, 2));
});
