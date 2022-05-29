/* eslint-disable @typescript-eslint/no-explicit-any */
import type { State, Grant } from './types';
import { grantString } from './core';

export type grantActionFilterResult = [
  state: State,
  errors: string[]
];

/**
 * Method filters a state object based on grants.
 */
function grantActionFilter(state: State, grants: Grant[]): grantActionFilterResult {
  const newState: State = {};
  const errors: string[] = [];

  /**
   * Loop through grant strings.
   */
  grants.every((grant) => {
    const { type, path } = grant;

    /**
     * The filters only applies to action grants.
     * Continue to the next loop if it's not an action grant.
     */
    if (type !== '@action') {
      return true;
    }

    const [sliceKey, propKey] = path.split('.');

    if (!sliceKey || !propKey) {
      errors.push(`The grant '${grantString(grant)}' state path was invalid.`);
      return true;
    }

    /**
     * Only copy granted properties on the state.
     */
    if (!state[sliceKey]?.[propKey]) {
      errors.push(`The grant '${grantString(grant)}' was skipped because it doesn't exist on state.`);
      return true;
    }

    newState[sliceKey] = newState[sliceKey] ?? {};
    newState[sliceKey][propKey] = state[sliceKey][propKey];

    return true;
  });

  return [newState, errors];
}

export default grantActionFilter;
