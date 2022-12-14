import {
  Io,
  IoProcess,
  ApiAuthLogin,
  StateEntities,
  UID,
  challengeDecode,
  ioOutputApply,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';
import { authenticateAccount } from '../utility/authenticate.js';

const process: IoProcess<
Io<ApiAuthLogin, StateEntities>
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

export const processAuthLogin = mwValidate('ApiAuthLogin')(process);

export default { processAuthLogin };
