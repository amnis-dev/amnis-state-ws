/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  entityClean,
  entityCreate,
  Io,
  ioOutput,
  IoProcess,
  Role,
  selectRoleGrants,
  State,
  StateCreator,
  StateEntities,
  Task,
  UID,
} from '@amnis/core';
import { mwAccess, mwValidate } from '../mw/index.js';
import { authorizeWall } from '../utility/authorize.js';

const process: IoProcess<
Io<StateCreator, StateEntities>
> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body, access } = input;
    const output = ioOutput<StateEntities>();

    const roleRefs: UID<Role>[] = access?.roles || [];

    /**
     * Get array of grants from roles in the service store.
     */
    const grants = selectRoleGrants(store.getState(), roleRefs);

    /**
   * Filter non-granted slices on the body (which is a State type).
   */
    const stateAuthwalled = authorizeWall(body, grants, Task.Create);

    /**
     * Clean entity properties that should not be updated.
     */
    let entityIssue = false;
    const stateUpdateSanatizd = Object.keys(stateAuthwalled).reduce<State>((state, key) => {
      state[key] = stateAuthwalled[key].map(
        (entity: any) => {
          const cleaned = entityClean(key, entity);
          if (cleaned) {
            return entityCreate(
              cleaned,
              { $owner: access?.sub, $creator: access?.sub, committed: true },
            );
          }
          entityIssue = true;
          return undefined;
        },
      ).filter((entity: any) => entity !== undefined);
      return state;
    }, {});

    if (entityIssue) {
      output.status = 401; // 401 Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Invalid UID',
        description: 'There was an invalid identifier key used.',
      });
      return output;
    }

    /**
     * finalized state to process
     */
    const stateFinal = access?.adm === true ? body : stateUpdateSanatizd;

    const result = await database.create(stateFinal);

    /**
   * Add errors for denied keys.
   */
    const deniedKeys = Object.keys(body).map((sliceKey) => {
      if (typeof result[sliceKey] !== 'object' || Object.keys(result[sliceKey]).length < 1) {
        return sliceKey;
      }
      return null;
    }).filter((value) => value !== null);

    if (deniedKeys.length) {
      output.json.logs.push({
        level: 'error',
        title: 'Creations Disallowed',
        description: `Missing permissions to create documents in the collections: ${deniedKeys.join(', ')}`,
      });
    }

    output.json.result = result;

    return output;
  }
);

export const crudProcessCreate = mwAccess()(
  mwValidate('StateCreator')(
    process,
  ),
);

export default { crudProcessCreate };
