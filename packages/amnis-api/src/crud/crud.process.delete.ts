/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UID } from '@amnis/core/types.js';
import type { Role } from '@amnis/core/role/index.js';
import type { StateDelete } from '@amnis/core/state/index.js';
import { selectors } from '@amnis/core/selectors.js';
import { coreActions } from '@amnis/core/actions.js';
import { Task } from '@amnis/core/grant/index.js';
import { authwall } from '@amnis/auth/authwall.js';
import { authScopeCreate } from '@amnis/auth/scope.js';
import type { ApiProcess } from '../types.js';
import type { ApiCrudIODelete } from './crud.types.js';
import { apiOutput } from '../api.js';
import { mwJwt } from '../mw.jwt.js';
import { mwValidate } from '../mw.validate.js';

export const process: ApiProcess<ApiCrudIODelete> = (context) => (
  async (input) => {
    const { store, database } = context;
    const { body, jwt } = input;
    const output = apiOutput<StateDelete>();

    const roleRefs: UID<Role>[] = jwt?.roles || [];

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
    const stateFinal = jwt?.adm === true ? body : stateAuthwalled as StateDelete;

    /**
     * Create an authentication scope object from the array of grant objects.
     */
    const authScope = jwt?.adm === true ? undefined : authScopeCreate(grants, Task.Update);

    const result = await database.delete(
      stateFinal,
      {
        scope: authScope,
        subject: jwt?.sub,
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

    /**
     * Create historic records of the delete.
     * TODO: Determine if necessary.
     */
    // const stateUpdateHistory: StateUpdate = {
    //   [historyKey]: [],
    // };
    // Object.keys(stateFinal).every((sliceKey) => {
    //   if (sliceKey === historyKey) {
    //     return true;
    //   }
    //   stateFinal[sliceKey].forEach((deleteId) => {
    //     const deleteUpdateObj: StateUpdateEntity = {
    //       $id: deleteId,
    //       delete: true,
    //     };
    //     stateUpdateHistory[historyKey].push(deleteUpdateObj);
    //   });

    //   return true;
    // });

    // const stateCreateHistory = historyMake(stateUpdateHistory, jwt?.sub);
    // await database.create(stateCreateHistory);

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
