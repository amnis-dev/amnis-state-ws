/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  coreActions,
  entityClean,
  historyKey,
  historyMake,
  Io,
  ioOutput,
  IoProcess,
  selectRoleGrants,
  State,
  StateCreate,
  stateScopeCreate,
  StateUpdate,
  Task,
  User,
  userKey,
} from '@amnis/core';
import { passCreate } from '../crypto/pass.js';
import { mwJwt, mwValidate } from '../mw/index.js';
import { authorizeWall } from '../utility/authorize.js';

export const process: IoProcess<
Io<StateUpdate, StateCreate>
> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body, jwt } = input;
    const output = ioOutput();

    if (!jwt) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'Access token is invalid.',
      });
      return output;
    }

    /**
     * Get array of grants from roles in the service store.
     */
    const grants = selectRoleGrants(store.getState(), jwt.roles);

    /**
     * Filter non-granted slices on the body (which is a State type).
     */
    const stateAuthwalled = authorizeWall(body, grants, Task.Update);

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
     * Ensure all user passwords are hashed.
     */
    if (stateUpdateSanatizd[userKey]) {
      stateUpdateSanatizd[userKey].forEach((entity: User) => {
        if (entity.password) {
          entity.password = passCreate(entity.password);
        }
      });
    }

    /**
     * finalized state to process
     */
    const stateFinal = jwt.adm === true ? body : stateUpdateSanatizd as StateUpdate;

    /**
     * Flag final state entities as committed
     */
    Object.values(stateFinal).forEach((slice) => {
      slice.forEach((entity) => {
        entity.committed = true;
      });
    });

    /**
     * Create an authentication scope object from the array of grant objects.
     */
    const authScope = jwt.adm === true ? undefined : stateScopeCreate(grants, Task.Update);

    const result = await database.update(
      stateFinal,
      {
        scope: authScope,
        subject: jwt.sub,
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
     * Create historic records of the updates.
     */
    const stateCreateHistory = historyMake(stateFinal, jwt.sub, deniedKeys, true);
    const resultHistory = await database.create(stateCreateHistory);
    output.json.result[historyKey] = resultHistory[historyKey];

    /**
     * Update the server store with possible changes.
     */
    store.dispatch(coreActions.update(result));

    return output;
  }
);

export const crudProcessUpdate = mwJwt()(
  mwValidate('StateUpdate')(
    process,
  ),
);

export default crudProcessUpdate;
