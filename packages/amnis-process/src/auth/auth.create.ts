import {
  Io,
  IoProcess,
  StateEntities,
  ApiAuthCreate,
  base64Decode,
  ioOutputApply,
  base64JsonDecode,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { mwSession, mwValidate } from '../mw/index.js';
import { accountCreate } from '../utility/account.js';
import { challengeValidate } from '../utility/index.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<ApiAuthCreate, StateEntities>
> = (context) => (
  async (input, output) => {
    const { store, crypto, validators } = context;
    const { body, session } = input;
    const system = systemSelectors.selectActive(store.getState());

    if (!session) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Session Required',
        description: 'A session is required to proceed with account creation.',
      });
      return output;
    }

    if (!system) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available for account creation.',
      });
      return output;
    }

    if (session.prv !== true) {
      output.status = 401;
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'This account is not authorized to create other accounts.',
      });
      return output;
    }

    const {
      challenge: challengeEncoded,
      signature: signatureEncoded,
      ...creationProps
    } = body;

    /**
     * Decode the challenge.
     */
    const challenge = base64JsonDecode(challengeEncoded);
    if (!challenge) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Challenge',
        description: 'Could not parse the provided challenge.',
      });
      return output;
    }

    /**
     * Validate the structure of the challenge.
     */
    const outputValidateChallenge = validate(validators.Challenge, challenge);
    if (outputValidateChallenge) {
      return outputValidateChallenge;
    }

    /**
     * Validate that the challenge data matches the server issued challenge.
     */
    const outputChallengeValid = challengeValidate(context, challenge);
    if (outputChallengeValid !== true) {
      return outputChallengeValid;
    }

    /**
     * Decode and validate the sigature.
     */
    const signature = base64Decode(signatureEncoded).buffer;
    const sessionPublicKey = await crypto.keyImport(session.pub);
    const data = Object.values(creationProps).reduce<string>(
      (acc, cur) => acc + cur,
      '',
    );
    const validSignature = await crypto.asymVerify(
      data,
      signature,
      sessionPublicKey,
    );

    if (validSignature !== true) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Signature',
        description: 'The creation signature does not match.',
      });
      return output;
    }

    /**
     * Since all else checks out, create the account.
     */
    ioOutputApply(output, await accountCreate(context, creationProps));

    return output;
  }
);

export const processAuthCreate = mwValidate('ApiAuthCreate')(
  mwSession()(
    process,
  ),
) as IoProcess<
Io<ApiAuthCreate, StateEntities>
>;

export default { processAuthCreate };
