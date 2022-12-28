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
      handle,
      $credential,
      signature,
      password,
    } = body;

    /**
     * Decode the challenge.
     */
    const challengeDecoded = challengeDecode(challenge);

    if (!challengeDecoded) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Challenge',
        description: 'The provided challenge could not be parsed.',
      });
      return output;
    }

    const outputAuthentication = await authenticateAccount(
      context,
      challengeDecoded,
      handle,
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

export const processAuthLogin = mwValidate('ApiAuthLogin')(
  process,
) as IoProcess<
Io<ApiAuthLogin, StateEntities>
>;

export default { processAuthLogin };
