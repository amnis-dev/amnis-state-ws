/* eslint-disable @typescript-eslint/no-explicit-any */
import { State } from './core.types';
import type { LicenseGrant } from './license';
import { licenseGrantToString } from './license/license';

export type authFilterResult = [
  state: State,
  errors: string[]
];

/**
 * Method filters a state object based on license grants.
 */
function authStateFilter(state: State, grants: LicenseGrant[]): authFilterResult {
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
      errors.push(`The grant state path was invalid. Grant: ${licenseGrantToString(grant)}`);
      return true;
    }

    /**
     * Only copy granted properties on the state.
     */
    if (!state[sliceKey]?.[propKey]) {
      errors.push(`The grant was skipped because it doesn't exist on state. Grant: ${licenseGrantToString(grant)}`);
      return true;
    }

    newState[sliceKey] = newState[sliceKey] ?? {};
    newState[sliceKey][propKey] = state[sliceKey][propKey];

    return true;
  });

  return [newState, errors];
}

export default authStateFilter;
