import {
  Challenge,
  challengeCreate,
  dateNumeric,
  IoContext,
  IoOutput,
  ioOutput,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  systemSelectors,
} from '@amnis/state';
import { validate } from '../validate.js';

/**
 * Create a challenge from context and output it.
 */
export const challengeNew = async (
  context: IoContext,
): Promise<IoOutput<Challenge>> => {
  const { store, crypto } = context;

  const system = systemSelectors.selectActive(store.getState());

  if (!system) {
    const output = ioOutput();
    output.status = 503;
    output.json.logs.push({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to generate new challenges.',
    });
    return output;
  }

  /**
   * Create the challenge string.
   */
  const challangeValue = await crypto.randomString(32);

  /**
   * Generate the unique challange code to send back.
   */
  const challengeItem = challengeCreate({
    val: challangeValue,
    exp: dateNumeric(`${system.challengeExpiration}m`),
  });

  /**
   * Store the challenge on the io store to check against later.
   */
  store.dispatch(challengeActions.insert(challengeItem));

  const output = ioOutput();
  output.status = 200;
  output.json.result = challengeItem;
  return output;
};

/**
 * Validate a challenge from context.
 */
export const challengeValidate = (
  context: IoContext,
  challenge: Challenge,
): true | IoOutput => {
  const { store, validators } = context;

  /**
   * Validate the structure of the challenge.
   */
  const outputValidate = validate(validators.Challenge, challenge);
  if (outputValidate) {
    return outputValidate;
  }

  /**
   * Verify that the challenge code is valid.
   */
  const challengeServer = challengeSelectors.selectById(store.getState(), challenge.$id);

  /**
   * Challenge not found on the server store.
   */
  if (!challengeServer || challenge.val !== challengeServer.val) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [{
      level: 'error',
      title: 'Invalid Challenge',
      description: 'The challenge value is not valid',
    }];
    return output;
  }

  /**
   * Challenge cannot be used anymore if expired.
   * Expired challenges are cleaned up later.
   */
  if (challengeServer.exp <= dateNumeric()) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [{
      level: 'error',
      title: 'Challenge Code Expired',
      description: 'The challenge code has expired.',
    }];
    return output;
  }

  /**
   * Remove the challenge from the server store once verified.
   */
  store.dispatch(challengeActions.delete(challenge.$id));

  return true;
};
