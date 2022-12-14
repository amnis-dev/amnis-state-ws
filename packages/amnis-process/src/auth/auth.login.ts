import {
  Io,
  IoProcess,
  AuthLogin,
  StateEntities,
  UID,
  challengeDecode,
  ioOutputApply,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';
import { authenticateAccount } from '../utility/authenticate.js';

const process: IoProcess<
Io<AuthLogin, StateEntities>
> = (context) => (
  async (input, output) => {
    const { body } = input;

    const {
      challenge,
      username,
      $credential,
      signature,
      password,
    } = body;

    /**
     * Decode the challenge.
     */
    const challengeDecoded = challengeDecode(challenge);

    const outputAuthentication = await authenticateAccount(
      context,
      challengeDecoded,
      username,
      $credential as UID,
      signature,
      password,
    );

    /**
     * Complete the authentication.
     */
    ioOutputApply(
      output,
      outputAuthentication,
    );

    return output;
  }
);

export const processAuthLogin = mwValidate('AuthLogin')(process);

export default { processAuthLogin };
