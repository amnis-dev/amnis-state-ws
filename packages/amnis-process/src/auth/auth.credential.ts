import {
  Io,
  IoProcess,
  ApiAuthCredential,
  StateEntities,
  ioOutputApply,
} from '@amnis/core';
import {
  mwChallenge, mwCredential, mwSignature, mwValidate,
} from '../mw/index.js';
import { accountCredentialAdd } from '../utility/account.js';
import { findUserById } from '../utility/find.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<ApiAuthCredential, StateEntities>
> = (context) => (
  async (input, output) => {
    const { validators } = context;
    const {
      challenge,
    } = input;
    const {
      credential,
    } = input.body;

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
     * Ensure the challenge has a subject.
     */
    const { $sub } = challenge;
    if (!$sub) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'No Subject',
        description: 'There is no subject to apply the new credential.',
      });
      return output;
    }

    /**
     * Validate the structure of the credential.
     */
    const outputValidateCredential = validate(validators.Credential, credential);
    if (outputValidateCredential) {
      return outputValidateCredential;
    }

    /**
     * Find the subject.
     */
    const user = await findUserById(context, $sub);
    if (!user) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Subject Not Found',
        description: 'The subject for the credential could not be found.',
      });
      return output;
    }

    /**
     * If it gets here, we can register the new credential with the user.
     */
    ioOutputApply(output, await accountCredentialAdd(context, user, credential));

    return output;
  }
);

export const processAuthCredential = mwValidate('ApiAuthCredential')(
  mwChallenge({
    $sub: true,
    otp: true,
  })(
    mwCredential(true)(
      mwSignature()(
        process,
      ),
    ),
  ),
) as IoProcess<
Io<ApiAuthCredential, StateEntities>
>;

export default { processAuthCredential };
