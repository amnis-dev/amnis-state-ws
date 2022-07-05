/* eslint-disable @typescript-eslint/no-explicit-any */
import { authwall } from '@amnis/auth/authwall';
import { Grant, Task } from '@amnis/core/grant';
import { selectors } from '@amnis/core/selectors';
import { authScopeCreate } from '@amnis/auth/scope';
import { StateCreate, StateQuery, stateReferenceQuery } from '@amnis/core/state';
import type { Database } from '@amnis/db/types';
import type { AuthScope } from '@amnis/auth/types';
import type{ Reference } from '@amnis/core/types';
import type { ApiContextMethod } from '../types';
import { apiOutput } from '../api';
import type { ApiCrudProcessRead } from './crud.types';

async function readRecursive(
  database: Database,
  grants: Grant[],
  query: StateQuery,
  authScope: AuthScope | undefined,
  subject: Reference,
  depth: number,
): Promise<StateCreate> {
  const result = await database.read(query, authScope, subject);
  if (depth < 1) {
    return result;
  }
  const queryNext = stateReferenceQuery(result);
  const queryAuthwalled: StateQuery = authwall(queryNext, grants, Task.Read);
  const nextResult = await readRecursive(
    database,
    grants,
    queryAuthwalled,
    authScope,
    subject,
    depth - 1,
  );

  Object.keys(nextResult).forEach((sliceKey) => {
    if (Array.isArray(result[sliceKey])) {
      result[sliceKey].push(...nextResult[sliceKey]);
    } else {
      result[sliceKey] = [...nextResult[sliceKey]];
    }
  });

  return result;
}

export const crudProcessRead: ApiContextMethod = (context): ApiCrudProcessRead => (
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

export default crudProcessRead;
