/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  coreActions,
  dateJSON,
  entityClean,
  historyKey,
  historyMake,
  Io,
  IoProcess,
  logCreator,
  selectRoleGrants,
  State,
  StateCreator,
  stateScopeCreate,
  StateUpdater,
  GrantTask,
  userKey,
} from '@amnis/core';
import { mwAccess, mwValidate } from '../mw/index.js';
import { authorizeWall } from '../utility/authorize.js';

export const process: IoProcess<
Io<StateUpdater, StateCreator>
> = (context) => (
  async (input, output) => {
    const { store, database, crypto } = context;
    const { body, access } = input;

    if (!access) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Access bearer is invalid.',
      });
      return output;
    }

    /**
     * Get array of grants from roles in the service store.
     */
    const grants = selectRoleGrants(store.getState(), access.roles);

    /**
     * Filter non-granted slices on the body (which is a State type).
     */
    const stateAuthwalled = authorizeWall(body, grants, GrantTask.Update);

    /**
     * Clean entity properties that should not be updated.
     */
    const stateUpdateSanatizd = Object.keys(stateAuthwalled).reduce<State>((state, key) => {
      state[key] = stateAuthwalled[key].map(
        (entity: any) => entityClean(key, entity),
      ).filter((entity: any) => entity !== undefined);
      return state;
    }, {});

    /**
     * UPDATE EXCEPTION: User Entities.
     */
    if (stateUpdateSanatizd[userKey]) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const entity of stateUpdateSanatizd[userKey]) {
        if (entity) {
          /**
           * User handles cannot be altered through this process.
           */
          if (entity.handle) {
            output.json.logs.push({
              level: 'error',
              title: 'Update Failed',
              description: 'A user\'s handle property cannot be updated.',
            });
            output.json.result = {};
            return output;
          }
          /**
           * Ensure all user passwords are hashed.
           */
          if (entity.password) {
            entity.password = await crypto.passHash(entity.password);
          }
        }
      }
    }

    /**
     * finalized state to process
     */
    const stateFinal = access.adm === true ? body : stateUpdateSanatizd as StateUpdater;

    /**
     * Flag final state entities as committed and update the updated date.
     * This object is for the database update.
     */
    const stateUpdateObject = Object.keys(stateFinal).reduce<StateUpdater>((acc, key) => {
      acc[key] = stateFinal[key].map((entity) => ({
        ...entity,
        committed: true,
        updated: dateJSON(),
      }));
      return acc;
    }, {});

    /**
     * Create an authentication scope object from the array of grant objects.
     */
    const authScope = access.adm === true ? undefined : stateScopeCreate(grants, GrantTask.Update);

    const result = await database.update(
      stateUpdateObject,
      {
        scope: authScope,
        subject: access.sub,
      },
    );

    /**
     * Output the result.
     */
    output.json.result = result;

    /**
     * Add errors for denied keys.
     */
    const deniedKeys = Object.keys(body).map((sliceKey) => {
      if (typeof result[sliceKey] !== 'object' || Object.keys(result[sliceKey]).length < 1) {
        return sliceKey;
      }
      return null;
    }).filter((value) => value !== null) as string[];

    if (deniedKeys.length) {
      output.json.logs.push({
        level: 'error',
        title: 'Updates Disallowed',
        description: `Missing permissions to update the collections: ${deniedKeys.join(', ')}`,
      });
    }

    /**
     * Create a possible success output.
     */
    const acceptedKeys = Object.keys(result).filter((key) => !deniedKeys.includes(key));
    if (acceptedKeys.length > 0) {
      output.json.logs.push(logCreator({
        level: 'success',
        title: 'Update Successful',
        description: `Updated records in collection${acceptedKeys.length > 1 ? 's' : ''}: ${acceptedKeys.join(', ')}.`,
      }));
    }

    /**
     * Create historic records of the updates.
     */
    const stateCreateHistory = historyMake(stateFinal, access.sub, deniedKeys, true);
    const resultHistory = await database.create(stateCreateHistory);
    if (resultHistory[historyKey]?.length) {
      output.json.result[historyKey] = resultHistory[historyKey];
    }

    /**
     * Update the server store with possible changes.
     */
    store.dispatch(coreActions.insert(result));

    return output;
  }
);

export const processCrudUpdate = mwAccess()(
  mwValidate('StateUpdater')(
    process,
  ),
) as IoProcess<
Io<StateUpdater, StateCreator>
>;

export default processCrudUpdate;
