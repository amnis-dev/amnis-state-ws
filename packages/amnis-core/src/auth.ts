/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  State, Grant, Task,
} from './types';

export type grantActionFilterResult = [
  state: State,
  errors: string[]
];

/**
 * Method filters a state object based on grants.
 */
function grantFilter(
  state: State,
  grants: Grant[],
  attempt: Task,
): grantActionFilterResult {
  const newState: State = {};
  const errors: string[] = [];

  /**
   * Loop through grant strings.
   */
  grants.every((grant) => {
    if (!grant) {
      return true;
    }

    // eslint-disable-next-line no-bitwise
    if ((grant.task & attempt) !== attempt) {
      return true;
    }

    if (!state[grant.key]) {
      return true;
    }

    newState[grant.key] = state[grant.key];

    return true;
  });

  return [newState, errors];
}

export default grantFilter;
