import {
  Io,
  IoProcess,
  ApiAuthCredential,
  StateEntities,
  challengeDecode,
  base64JsonDecode,
  base64Decode,
  ioOutputApply,
  Credential,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';
import { accountCredentialAdd } from '../utility/account.js';
import { challengeValidate } from '../utility/challenge.js';
import { findUserById } from '../utility/find.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<ApiAuthCredential, StateEntities>
> = (context) => (
  async (input, output) => {
    const { crypto, validators } = context;
    const {
      challenge: challengeEncoded,
      signature: signatureEncoded,
      credential: credentialEncoded,
    } = input.body;

    /**
     * Decode and validate the challenge.
     */
    const challenge = challengeDecode(challengeEncoded);
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
    const { $subject } = challenge;
    if (!$subject) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'No Subject',
        description: 'There is no subject to apply the new credential.',
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
     * Decode the credential.
     */
    const credential = base64JsonDecode<Credential>(credentialEncoded);
    if (!credential) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Credential',
        description: 'Could not parse the provided credential.',
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
     * Decode and validate the sigature.
     */
    const signature = base64Decode(signatureEncoded).buffer;
    const credentialPublicKey = await crypto.keyImport(credential.publicKey);
    const validSignature = await crypto.asymVerify(
      credentialEncoded,
      signature,
      credentialPublicKey,
    );

    if (validSignature !== true) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Invalid Signature',
        description: 'The credential signature does not match.',
      });
      return output;
    }

    /**
     * Find the subject.
     */
    const user = await findUserById(context, $subject);
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
  process,
) as IoProcess<
Io<ApiAuthCredential, StateEntities>
>;

export default { processAuthCredential };
