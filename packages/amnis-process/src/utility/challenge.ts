import {
  Challenge,
  challengeCreator,
  dateNumeric,
  IoContext,
  IoOutput,
  ioOutput,
  UID,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  systemSelectors,
} from '@amnis/state';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export interface ChallengeCreateOptions {
  $subject?: UID;
  privatize?: boolean;
}

/**
 * Create a challenge from context and output it.
 */
export const challengeCreate = async (
  context: IoContext,
  options: ChallengeCreateOptions = {},
): Promise<IoOutput<Challenge>> => {
  const { store, crypto } = context;

  const system = systemSelectors.selectActive(store.getState());

  if (!system) {
    const output = ioOutput();
    output.status = 500;
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
  const challengeItem = challengeCreator({
    value: challangeValue,
    expires: dateNumeric(`${system.registrationExpiration}m`),
  });

  if (options.$subject) {
    challengeItem.$subject = options.$subject;
  }

  if (options.privatize === true) {
    let challangeValuePrivate = await crypto.randomString(12);
    const matchesSpecialChars = challangeValuePrivate.match(/[^a-z^A-Z^0-9]/gm);
    matchesSpecialChars?.forEach((c) => {
      challangeValuePrivate = challangeValuePrivate.replace(
        c,
        alphabet.charAt(
          Math.floor(Math.random() * alphabet.length),
        ),
      );
    });
    challengeItem.otp = challangeValuePrivate.toLowerCase();
  }

  /**
   * Store the challenge on the io store to check against later.
   */
  store.dispatch(challengeActions.create(challengeItem));

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
    output.json.logs = [{
      level: 'error',
      title: 'Invalid Challenge Code',
      description: 'The challenge code is not valid',
    }];
    return output;
  }

  /**
   * Challenge cannot be used anymore if expired.
   * Expired challenges are cleaned up later.
   */
  if (challengeServer.expires <= dateNumeric()) {
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
   * Ensure that this challenge matches the intended specific subject.
   */
  if (
    (challengeServer.$subject || challenge.$subject)
    && challengeServer.$subject !== challenge.$subject
  ) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [{
      level: 'error',
      title: 'Not Challenged',
      description: 'This challenge code is intended for another use.',
    }];
    return output;
  }

  /**
   * Ensure that this challenge's private value is validated against if set.
   */
  if (
    (challengeServer.otp || challenge.otp)
    && challengeServer.otp !== challenge.otp
  ) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [{
      level: 'error',
      title: 'Challenged Privately',
      description: 'This challenge code required a one-time passcode.',
    }];
    return output;
  }

  /**
   * Remove the challenge from the server store once verified.
   */
  store.dispatch(challengeActions.delete(challenge.$id));

  return true;
};
