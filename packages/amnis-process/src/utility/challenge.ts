import {
  Challenge,
  challengeCreator,
  challengeKey,
  dateNumeric,
  entityCreate,
  IoContext,
  IoInput,
  IoOutput,
  ioOutput,
  logCreator,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  systemSelectors,
} from '@amnis/state';

/**
 * Create a challenge from context and output it.
 */
export const challengeCreate = async (
  context: IoContext,
  input: IoInput,
) => {
  const { store, crypto } = context;
  const { access } = input;

  const system = systemSelectors.selectActive(store.getState());

  if (!system) {
    const output = ioOutput();
    output.status = 500;
    output.json.logs.push(logCreator({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to initalize the registration.',
    }));
    return output;
  }

  if (system.registrationOpen !== true) {
    const isAdmin = access?.roles.includes(system.$adminRole);
    const isExec = access?.roles.includes(system.$execRole);

    if (!isAdmin && !isExec) {
      const output = ioOutput();
      output.status = 500;
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'Registration Closed',
        description: 'The system has disabled registration.',
      }));
      return output;
    }
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
  username?: string,
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
  if (challenge.username && username && challenge.username !== username) {
    const output = ioOutput();
    output.status = 500; // Internal Server Error
    output.json.logs = [logCreator({
      level: 'error',
      title: 'User Not Challenged',
      description: 'This challenge code is indended for another user.',
    })];
    return output;
  }

  /**
   * Remove the challenge from the server store once verified.
   */
  store.dispatch(challengeActions.delete(challenge.$id));

  return true;
};
