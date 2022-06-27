/* eslint-disable @typescript-eslint/no-explicit-any */
import { authwall } from '@amnis/auth/authwall';
import { coreActions } from '@amnis/core/actions';
import { entityClean, entityCreate } from '@amnis/core/entity';
import { Task } from '@amnis/core/grant';
import { selectors } from '@amnis/core/selectors';
import type { State } from '@amnis/core/state';
import type { Role } from '@amnis/core/role';
import type{ Reference } from '@amnis/core/types';
import type { ApiContextMethod } from '../types';
import { apiOutput } from '../api';
import type { ApiCrudProcessCreate } from './crud.types';

export const crudProcessCreate: ApiContextMethod = (context): ApiCrudProcessCreate => (
  async (input) => {
    const { store, database } = context;
    const { body, jwt } = input;
    const output = apiOutput();

    const roleRefs: Reference<Role>[] = jwt?.roles || [];

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
              { $owner: jwt?.sub },
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
        title: 'Invalid Identifier',
        description: 'There was an invalid identity key used.',
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

    /**
   * Update the server store with the creation of the entity.
   */
    store.dispatch(coreActions.create(result));

    return output;
  }
);

export default crudProcessCreate;
