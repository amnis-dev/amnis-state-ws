import {
  Challenge,
  challengeCreator,
  challengeKey,
  dateNumeric,
  entityCreate,
  IoContext,
  IoOutput,
  ioOutput,
  logCreator,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  systemSelectors,
} from '@amnis/state';

export interface ChallengeCreateOptions {
  username?: string;
  privatize?: boolean;
}

export interface ChallengeValidateOptions {
  username?: string;
  valuePrivate?: string;
}

/**
 * Create a challenge from context and output it.
 */
export const challengeCreate = async (
  context: IoContext,
  options: ChallengeCreateOptions = {},
) => {
  const { store, crypto } = context;

  const system = systemSelectors.selectActive(store.getState());

  if (!system) {
    const output = ioOutput();
    output.status = 500;
    output.json.logs.push(logCreator({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to generate new challenges.',
    }));
    return output;
  }

  /**
   * Create the challenge string.
   */
  const challangeValue = await crypto.randomString(32);

  /**
   * Generate the unique challange code to send back.
   */
  const challengeEntity = entityCreate(
    challengeCreator({
      value: challangeValue,
      expires: dateNumeric(`${system.registrationExpiration}m`),
    }),
  );

  if (options.username) {
    challengeEntity.username = options.username;
  }

  if (options.private === true) {
    const challangeValuePrivate = await crypto.randomString(16);
    challengeEntity.valuePrivate = challangeValuePrivate;
  }

  /**
   * Store the challenge on the io store to check against later.
   */
  store.dispatch(challengeActions.insert(challengeEntity));

  const output = ioOutput();
  output.status = 200;
  output.json.result = {
    [challengeKey]: [challengeEntity],
  };
  return output;
};

/**
 * Validate a challenge from context.
 */
export const challengeValidate = (
  context: IoContext,
  challenge: Challenge,
  options: ChallengeValidateOptions = {},
): true | IoOutput => {
  const { store } = context;
  /**
   * Verify that the challenge code is valid.
   */
  const challengeServer = challengeSelectors.selectById(store.getState(), challenge.$id);

  /**
   * Challenge not found on the server store.
   */
  if (!challengeServer || challenge.value !== challengeServer.value) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [logCreator({
      level: 'error',
      title: 'Invalid Challenge Code',
      description: 'The challenge code required for registration is not valid',
    })];
    return output;
  }

  /**
   * Challenge cannot be used anymore if expired.
   * Expired challenges are cleaned up later.
   */
  if (challengeServer.expires <= dateNumeric()) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [logCreator({
      level: 'error',
      title: 'Challenge Code Expired',
      description: 'The challenge code required for registration has expired.',
    })];
    return output;
  }

  /**
   * Ensure that this challenge is not intended for a specific username.
   */
  if (challenge.username && challenge.username !== options.username) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [logCreator({
      level: 'error',
      title: 'Not Challenged',
      description: 'This challenge code is intended for another use.',
    })];
    return output;
  }

  /**
   * Ensure that this challenge's private value is validated against if set.
   */
  if (challenge.valuePrivate && challenge.valuePrivate !== options.valuePrivate) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [logCreator({
      level: 'error',
      title: 'Challenged is Private',
      description: 'This challenge code is private.',
    })];
    return output;
  }

  /**
   * Remove the challenge from the server store once verified.
   */
  store.dispatch(challengeActions.delete(challenge.$id));

  return true;
};
