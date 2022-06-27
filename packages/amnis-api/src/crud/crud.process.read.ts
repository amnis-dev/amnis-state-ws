/* eslint-disable @typescript-eslint/no-explicit-any */
import { authwall } from '@amnis/auth/authwall';
import { Task } from '@amnis/core/grant';
import { selectors } from '@amnis/core/selectors';
import { authScopeCreate } from '@amnis/auth/scope';
import type { ApiContextMethod } from '../types';
import { apiOutput } from '../api';
import type { ApiCrudProcessRead } from './crud.types';

export const crudProcessRead: ApiContextMethod = (context): ApiCrudProcessRead => (
  async (input) => {
    const { store, database } = context;
    const { body, jwt } = input;
    const output = apiOutput();

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
    const grants = selectors.selectRoleGrants(store.getState(), jwt.roles);

    /**
     * Filter non-granted slices on the body (which is a State type).
     */
    const stateAuthwalled = authwall(body, grants, Task.Read);

    /**
     * finalized state to process
     */
    const stateFinal = jwt.adm === true ? body : stateAuthwalled;

    /**
     * Create an authentication scope object from the array of grant objects.
     */
    const authScope = jwt.adm === true ? undefined : authScopeCreate(grants, Task.Read);

    const result = await database.read(stateFinal, authScope, jwt.sub);

    /**
     * Add errors for denied keys.
     */
    const deniedKeys = Object.keys(body).map((sliceKey) => {
      if (typeof result[sliceKey] !== 'object') {
        return sliceKey;
      }
      return null;
    }).filter((value) => value !== null);

    if (deniedKeys.length) {
      output.json.logs.push({
        level: 'error',
        title: 'Readings Disallowed',
        description: `Missing permissions to read from the collections: ${deniedKeys.join(', ')}`,
      });
    }

    output.json.result = result;

    return output;
  }
);

export default crudProcessRead;
