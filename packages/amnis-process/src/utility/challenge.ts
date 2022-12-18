import {
  Challenge,
  challengeCreator,
  dateNumeric,
  Entity,
  entityCreate,
  IoContext,
  IoOutput,
  ioOutput,
  logCreator,
  UID,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  systemSelectors,
} from '@amnis/state';

export interface ChallengeCreateOptions {
  $subject?: UID;
  privatize?: boolean;
}

export interface ChallengeValidateOptions {
  $subject?: UID;
  otp?: string;
}

/**
 * Create a challenge from context and output it.
 */
export const challengeCreate = async (
  context: IoContext,
  options: ChallengeCreateOptions = {},
): Promise<IoOutput<Entity<Challenge>>> => {
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

  if (options.$subject) {
    challengeEntity.$subject = options.$subject;
  }

  if (options.privatize === true) {
    const challangeValuePrivate = await crypto.randomString(12);
    challengeEntity.otp = challangeValuePrivate;
  }

  /**
   * Store the challenge on the io store to check against later.
   */
  store.dispatch(challengeActions.insert(challengeEntity));

  const output = ioOutput();
  output.status = 200;
  output.json.result = challengeEntity;
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
      description: 'The challenge code is not valid',
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
      description: 'The challenge code has expired.',
    })];
    return output;
  }

  /**
   * Ensure that this challenge is not intended for a specific subject.
   */
  if (challenge.$subject && challenge.$subject !== options.$subject) {
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
  if (challenge.otp && challenge.otp !== options.otp) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [logCreator({
      level: 'error',
      title: 'Challenged is Private',
      description: 'This challenge code required a one-time passcode.',
    })];
    return output;
  }

  /**
   * Remove the challenge from the server store once verified.
   */
  store.dispatch(challengeActions.delete(challenge.$id));

  return true;
};
