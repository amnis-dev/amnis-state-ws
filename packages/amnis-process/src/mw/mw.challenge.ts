import {
  base64JsonDecode,
  IoMiddleware,
} from '@amnis/core';
import { challengeValidate } from '../utility/challenge.js';
import { validate } from '../validate.js';

/**
 * Ensures a challenge object.
 */
export const mwChallenge: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { challengeEncoded } = input;

  if (!challengeEncoded) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Missing Challenge',
      description: 'Challenge data must be provided to complete this request.',
    });
    return output;
  }

  /**
   * Decode the challenge.
   */
  input.challenge = base64JsonDecode(challengeEncoded);
  const { challenge } = input;

  if (!challenge) {
    output.status = 500; // 401 Server Error
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Challenge',
      description: 'Failed to decode and parse the challenge data.',
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
