import {
  IoInput,
  IoMiddleware,
  State,
  GrantTask,
  grantStateFilter,
  entityStrip,
  profileKey,
  userKey,
  credentialKey,
} from '@amnis/core';
import { roleSelectors, systemSelectors } from '@amnis/state';
import { findUserById } from '../utility/find.js';

/**
 * List of special state slices with special exceptions on filtering and access.
 */
const slicesSpecial = [userKey, profileKey, credentialKey];

/**
 * Middleware that handle state filtering and sanitizing based on the
 * provided access object.
 */
export const mwState: IoMiddleware<GrantTask> = (
  (task) => (next) => (context) => async (input, output) => {
    const { access } = input;
    const { store } = context;

    /**
     * Ensure an access object is set.
     * mwAccess can provide an ananymous token.
     */
    if (!access) {
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Access has not been provided.',
      });
      return output;
    }

    /**
     * Obtain the system entity.
     */
    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 503; // Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to complete this process.',
      });
      return output;
    }

    const $subject = access.sub;
    const $permission = access.pem;

    /**
     * Get the grants from the role combination created during the user authentication.
     */
    let grants;

    /**
     * If there's a permissions reference, find and set the grants.
     */
    if ($permission) {
      const comboGrants = roleSelectors.selectComboGrants(store.getState(), $permission);
      if (comboGrants) {
        grants = comboGrants;
      }
    }

    /**
     * If no grants are found, provide anonymous grants.
     */
    if (!grants) {
      const roleAnon = roleSelectors.selectById(store.getState(), system.$anonymousRole);
      if (!roleAnon) {
        output.status = 401; // Unauthorized
        output.json.logs.push({
          level: 'error',
          title: 'Unauthorized',
          description: 'Client is not authorized to complete the process.',
        });
        return output;
      }
      grants = roleAnon.grants;
    }

    /**
     * Filter the state input.
     */
    const stateFiltered = grantStateFilter(grants, task, input.body);

    /**
     * Sanitize the filtered state.
     */
    const stateKeys = Object.keys(stateFiltered);
    if (task !== GrantTask.Delete) {
      stateKeys.forEach((key) => {
        stateFiltered[key] = entityStrip(stateFiltered[key]);
      });
    }

    const user = await findUserById(context, $subject);

    if (!user) {
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Provided user cannot be identified.',
      });
      return output;
    }

    /**
     * TODO: Add special cases, like admin owned data cannot be modified and such.
     */

    const inputNew: IoInput<State> = {
      ...input,
      body: stateFiltered,
    };

    return next(context)(inputNew, output);
  }
);

export default { mwState };
