import {
  Challenge,
  dateNumeric,
  IoContext,
  IoOutput,
  ioOutput,
  logCreator,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
} from '@amnis/state';

export const challengeValidate = (
  { store }: IoContext,
  challenge: Challenge,
): true | IoOutput => {
  /**
   * Verify that the challenge code is valid.
   */
  const challengeServer = challengeSelectors.selectById(store.getState(), challenge.$id);

  /**
   * Challenge not found on the server store.
   */
  if (!challengeServer) {
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
   * Remove the challenge from the server store once verified.
   */
  store.dispatch(challengeActions.delete(challenge.$id));

  return true;
};

export default { challengeValidate };
