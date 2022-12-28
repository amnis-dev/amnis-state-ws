import {
  Io,
  IoProcess,
  ApiAuthAuthenticate,
  StateEntities,
  challengeDecode,
  base64Decode,
  ioOutputApply,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { mwValidate, mwSession } from '../mw/index.js';
import { challengeValidate } from '../utility/challenge.js';
import { authenticateLogin, findUserById } from '../utility/index.js';

const process: IoProcess<
Io<ApiAuthAuthenticate, StateEntities>
> = (context) => (
  async (input, output) => {
    const { store, crypto } = context;
    const { body, session } = input;

    if (!session) {
      return output;
    }

    /**
     * Get the active system.
     */
    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 503; // 503 Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to authenticate.',
      });
      return output;
    }

    /**
     * Decode the challenge and the signature.
     */
    const {
      challenge: challengeEncoded,
      signature: signatureEncoded,
    } = body;

    /**
     * Decode the challenge.
     */
    const challenge = challengeDecode(challengeEncoded);
    if (!challenge) {
      output.status = 500; // 500 Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Challenge',
        description: 'Could not parse the provided challenge.',
      });
      return output;
    }

    /**
     * Ensure the challenge is valid.
     */
    const challengeVerified = challengeValidate(context, challenge);
    if (challengeVerified !== true) {
      ioOutputApply(output, challengeVerified);
      return output;
    }

    const signature = base64Decode(signatureEncoded).buffer;
    const publicKey = await crypto.keyImport(session.pub);

    /**
     * Ensure the session public key is valid.
     */
    if (!publicKey) {
      output.status = 500; // 500 Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Session Key',
        description: 'There was a problem importing the session key.',
      });
      return output;
    }

    /**
     * Verify the signed signature against the session's public key.
     */
    const signatureVerified = await crypto.asymVerify(challengeEncoded, signature, publicKey);

    if (!signatureVerified) {
      output.status = 500; // 500 Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Signature',
        description: 'Could not verify the provided agent signature.',
      });
      return output;
    }

    /**
     * Getting here means all the authentication checks were valid.
     * The session holder can be logged in.
     */
    const user = await findUserById(context, session.$subject);

    if (!user) {
      output.status = 500; // 500 Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'User Not Found',
        description: 'Could not find the user described in the session.',
      });
      return output;
    }

    ioOutputApply(output, await authenticateLogin(context, user, session.pub));

    return output;
  }
);

export const processAuthAuthenticate = mwValidate('ApiAuthAuthenticate')(
  mwSession()(
    process,
  ),
) as IoProcess<
Io<ApiAuthAuthenticate, StateEntities>
>;

export default { processAuthAuthenticate };
