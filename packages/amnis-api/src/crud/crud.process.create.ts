/* eslint-disable @typescript-eslint/no-explicit-any */
import { authwall } from '@amnis/auth/authwall.js';
import { entityClean, entityCreate } from '@amnis/core/entity/index.js';
import { Task } from '@amnis/core/grant/index.js';
import { selectors } from '@amnis/core/selectors.js';
import type { State, StateCreate } from '@amnis/core/state/index.js';
import type { Role } from '@amnis/core/role/index.js';
import type{ UID } from '@amnis/core/types.js';
import type { ApiProcess } from '../types.js';
import { apiOutput } from '../api.js';
import type { ApiCrudIOCreate } from './crud.types.js';
import { mwJwt } from '../mw.jwt.js';
import { mwValidate } from '../mw.validate.js';

const process: ApiProcess<ApiCrudIOCreate> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body, jwt } = input;
    const output = apiOutput<StateCreate>();

    const roleRefs: UID<Role>[] = jwt?.roles || [];

    /**
     * Get array of grants from roles in the service store.
     */
    const grants = selectors.selectRoleGrants(store.getState(), roleRefs);

    /**
   * Filter non-granted slices on the body (which is a State type).
   */
    const stateAuthwalled = authwall(body, grants, Task.Create);

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
              key,
              cleaned,
              { $owner: jwt?.sub, $creator: jwt?.sub },
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
    const stateFinal = jwt?.adm === true ? body : stateUpdateSanatizd;

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

export const crudProcessCreate = mwJwt()(
  mwValidate('StateCreate')(
    process,
  ),
);

export default { crudProcessCreate };
