import {
  Challenge, dateNumeric, IoContext, IoOutput, ioOutput, logCreator,
} from '@amnis/core';
import { challengeSelectors } from '@amnis/state';

export const challengeValidate = (context: IoContext, challenge: Challenge): true | IoOutput => {
  /**
   * Verify that the challenge code is valid.
   */
  const challengeServer = challengeSelectors.selectById(context.store.getState(), challenge.$id);

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

  return true;
};

export default { challengeValidate };
