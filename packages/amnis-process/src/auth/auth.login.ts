import {
  Io,
  IoProcess,
  AuthLogin,
  StateEntities,
  UID,
  challengeDecode,
  ioOutputApply,
} from '@amnis/core';
import { authenticateAccount } from '../utility/authenticate.js';
import { challengeCreate } from '../utility/challenge.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<AuthLogin, StateEntities>
> = (context) => (
  async (input, output) => {
    const { validators } = context;
    const { body } = input;

    /**
     * When the body is undefined, output data necessary to begin the
     * authentication ritual.
     */
    if (!body) {
      ioOutputApply(output, await challengeCreate(context, input));
      return output;
    }

    /**
     * Must validate the registration input if it's defined.
     */
    const validateOutput = validate(validators.AuthLogin, body);
    if (validateOutput) {
      ioOutputApply(output, validateOutput);
      console.log(JSON.stringify({ outputValidation: output }, null, 2));
      return output;
    }

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

export const authProcessLogin = process;

export default { authProcessLogin };
