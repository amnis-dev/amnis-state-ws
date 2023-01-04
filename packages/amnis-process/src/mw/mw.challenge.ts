import {
  base64JsonDecode,
  IoMiddleware,
} from '@amnis/core';
import { challengeValidate } from '../utility/challenge.js';
import { validate } from '../validate.js';

export interface MwChallengeOptions {
  /**
   * Require a subject on the challenge.
   */
  $sub?: boolean;

  /**
   * Require an OTP value on the subject.
   */
  otp?: boolean;
}

/**
 * Ensures a challenge object.
 */
export const mwChallenge: IoMiddleware<MwChallengeOptions> = ({
  $sub = false,
  otp = false,
}) => (next) => (context) => async (input, output) => {
  const { challengeEncoded } = input;

  if (!challengeEncoded) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Missing Challenge',
      description: 'A challenge must be provided to complete this request.',
    });
    return output;
  }

  /**
   * Decode the challenge.
   */
  input.challenge = base64JsonDecode(challengeEncoded);
  const { challenge } = input;

  if (!challenge) {
    output.status = 500; // 500 Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Challenge',
      description: 'Failed to decode and parse the challenge.',
    });
    return output;
  }

  if ($sub && !challenge.$sub) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invalid Challenge',
      description: 'This challenged request requires a subject.',
    });
    return output;
  }

  if (otp && (!challenge.otp || !challenge.otpl)) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invalid Challenge',
      description: 'This challenged request requires a one-time passcode.',
    });
    return output;
  }

  /**
   * Validate the structure of the challenge.
   */
  const outputValidate = validate(context.validators.Challenge, challenge);
  if (outputValidate) {
    return outputValidate;
  }

  const outputValid = await challengeValidate(context, challenge);

  if (outputValid !== true) {
    return outputValid;
  }

  // output.json.logs.push({
  //   level: 'info',
  //   title: 'Challenge Validated',
  //   description: 'The provided challenge value has successfully validated.',
  // });

  return next(context)(input, output);
};

export default { mwChallenge };
