/* eslint-disable @typescript-eslint/no-explicit-any */
import { authwall } from '@amnis/auth/authwall';
import { Grant, Task } from '@amnis/core/grant';
import { selectors } from '@amnis/core/selectors';
import { authScopeCreate } from '@amnis/auth/scope';
import { StateCreate, StateQuery, stateReferenceQuery } from '@amnis/core/state';
import type { Database } from '@amnis/db/types';
import type { AuthScope } from '@amnis/auth/types';
import type{ Reference } from '@amnis/core/types';
import type { ApiProcess } from '../types';
import { apiOutput } from '../api';
import type { ApiCrudIORead } from './crud.types';
import { mwJwt } from '../mw.jwt';
import { mwValidate } from '../mw.validate';

/**
 * Performs a recursive read on the database based on the depth value of each query.
 */
async function readRecursive(
  database: Database,
  grants: Grant[],
  query: StateQuery,
  authScope: AuthScope | undefined,
  subject: Reference,
  depth: number,
): Promise<StateCreate> {
  /**
   * Query for the initial result.
   */
  const result = await database.read(query, { scope: authScope, subject });

  /**
   * A search depth less than 1 means we no longer need to go deeper.
   * Return the final result.
   */
  if (depth < 1) {
    return result;
  }

  /**
   * Create the new query based on the references in the previous database result.
   */
  const queryNext = stateReferenceQuery(result);

  /**
   * Need to ensure the user has the right permissions for the next depth query.
   */
  const queryAuthwalled: StateQuery = authwall(queryNext, grants, Task.Read);

  /**
   * Process the next result
   */
  const nextResult = await readRecursive(
    database,
    grants,
    queryAuthwalled,
    authScope,
    subject,
    depth - 1,
  );

  /**
   * Merge the new result with the previous.
   */
  Object.keys(nextResult).forEach((sliceKey) => {
    if (Array.isArray(result[sliceKey])) {
      result[sliceKey].push(...nextResult[sliceKey]);
    } else {
      result[sliceKey] = [...nextResult[sliceKey]];
    }
  });

  return result;
}

export const process: ApiProcess<ApiCrudIORead> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body, jwt } = input;
    const output = apiOutput<StateCreate>();

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
    const stateAuthwalled: StateQuery = authwall(body, grants, Task.Read);

    /**
     * finalized state to process
     */
    const stateFinal: StateQuery = jwt.adm === true ? body : stateAuthwalled;

    /**
     * Create an authentication scope object from the array of grant objects.
     */
    const authScope = jwt.adm === true ? undefined : authScopeCreate(grants, Task.Read);

    /**
     * Build the result based on the query depth.
     */
    const resultPromises = Object.values(stateFinal).map((slice) => (
      readRecursive(database, grants, stateFinal, authScope, jwt.sub, slice.$depth || 0)
    ));
    const results = await Promise.all(resultPromises);
    const result = results.reduce<StateCreate>((prev, next) => {
      Object.keys(next).forEach((nextKey) => {
        if (Array.isArray(prev[nextKey])) {
          prev[nextKey].push(...next[nextKey]);
        } else {
          prev[nextKey] = next[nextKey];
        }
      });

      return prev;
    }, {});

    // const result = await database.read(stateFinal, authScope, jwt.sub);

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

export const crudProcessRead = mwJwt()(
  mwValidate('StateQuery')(
    process,
  ),
);

export default { crudProcessRead };
