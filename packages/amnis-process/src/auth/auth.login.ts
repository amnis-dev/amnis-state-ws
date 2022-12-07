import {
  Io,
  IoProcess,
  AuthLogin,
  StateEntities,
  UID,
  challengeDecode,
} from '@amnis/core';
import { authenticateAccount } from '../utility/authenticate.js';
import { challengeCreate } from '../utility/challenge.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<AuthLogin, StateEntities>
> = (context) => (
  async (input) => {
    const { validators } = context;
    const { body } = input;

    /**
     * When the body is undefined, output data necessary to begin the
     * authentication ritual.
     */
    if (!body) {
      const output = await challengeCreate(context, input);
      return output;
    }

    /**
     * Must validate the registration input if it's defined.
     */
    const validateOutput = validate(validators.AuthLogin, body);
    if (validateOutput) {
      return validateOutput;
    }

    const {
      challenge, username, $credential, signature,
    } = body;

    /**
     * Decode the challenge.
     */
    const challengeDecoded = challengeDecode(challenge);

    /**
     * Complete the authentication.
     */
    const output = await authenticateAccount(
      context,
      challengeDecoded,
      username,
      $credential as UID,
      signature,
    );

    return output;
  }
);

export const authProcessLogin = process;

export default { authProcessLogin };
