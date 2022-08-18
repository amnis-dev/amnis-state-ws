/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reference } from '@amnis/core/types';
import type { Role } from '@amnis/core/role';
import type { StateDelete } from '@amnis/core/state';
import { selectors } from '@amnis/core/selectors';
import { coreActions } from '@amnis/core/actions';
import { Task } from '@amnis/core/grant';
import { authwall } from '@amnis/auth/authwall';
import { authScopeCreate } from '@amnis/auth/scope';
import type { ApiProcess } from '../types';
import type { ApiCrudIODelete } from './crud.types';
import { apiOutput } from '../api';
import { mwJwt } from '../mw.jwt';
import { mwValidate } from '../mw.validate';

export const process: ApiProcess<ApiCrudIODelete> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body, jwt } = input;
    const output = apiOutput<StateDelete>();

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

    const result = await database.delete(
      stateFinal,
      {
        scope: authScope,
        subject: jwt?.sub,
        domain: jwt?.dmn,
      },
    );

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
     * StateDelete possible entities from the server store.
     */
    store.dispatch(coreActions.delete(result));

    return output;
  }
);

export const crudProcessDelete = mwJwt()(
  mwValidate('StateDelete')(
    process,
  ),
);

export default { crudProcessDelete };
