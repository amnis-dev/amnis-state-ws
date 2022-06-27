/* eslint-disable @typescript-eslint/no-explicit-any */
import { authwall } from '@amnis/auth/authwall';
import { Task } from '@amnis/core/grant';
import { selectors } from '@amnis/core/selectors';
import { authScopeCreate } from '@amnis/auth/scope';
import { coreActions } from '@amnis/core/actions';
import type { Reference } from '@amnis/core/types';
import type { Role } from '@amnis/core/role';
import type { ApiContextMethod } from '../types';
import { apiOutput } from '../api';
import type { ApiCrudProcessDelete } from './crud.types';

export const crudProcessDelete: ApiContextMethod = (context): ApiCrudProcessDelete => (
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
    const stateAuthwalled = authwall(body, grants, Task.Delete);

    /**
     * finalized state to process
     */
    const stateFinal = jwt?.adm === true ? body : stateAuthwalled;

    /**
     * Create an authentication scope object from the array of grant objects.
     */
    const authScope = jwt?.adm === true ? undefined : authScopeCreate(grants, Task.Update);

    const result = await database.delete(stateFinal, authScope, jwt?.sub);

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
        title: 'Deletes Disallowed',
        description: `Missing permissions to delete from the collections: ${deniedKeys.join(', ')}`,
      });
    }

    output.json.result = result;

    /**
     * Remove possible entities from the server store.
     */
    store.dispatch(coreActions.delete(result));

    return output;
  }
);

export default crudProcessDelete;
