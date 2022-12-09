/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  coreActions,
  Io, IoProcess, Role, selectRoleGrants, StateDeleter, stateScopeCreate, Task, UID,
} from '@amnis/core';
import { mwAccess, mwValidate } from '../mw/index.js';
import { authorizeWall } from '../utility/authorize.js';

export const process: IoProcess<
Io<StateDeleter, StateDeleter>
> = (context) => (
  async (input, output) => {
    const { store, database } = context;
    const { body, access } = input;

    const roleRefs: UID<Role>[] = access?.roles || [];

    /**
     * Get array of grants from roles in the service store.
     */
    const grants = selectRoleGrants(store.getState(), roleRefs);

    /**
     * Filter non-granted slices on the body (which is a State type).
     */
    const stateAuthwalled = authorizeWall(body, grants, Task.Delete);

    /**
     * finalized state to process
     */
    const stateFinal = access?.adm === true ? body : stateAuthwalled as StateDeleter;

    /**
     * Create an authentication scope object from the array of grant objects.
     */
    const authScope = access?.adm === true ? undefined : stateScopeCreate(grants, Task.Update);

    const result = await database.delete(
      stateFinal,
      {
        scope: authScope,
        subject: access?.sub,
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
    // const stateUpdateHistory: StateUpdater = {
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

    // const stateCreateHistory = historyMake(stateUpdateHistory, access?.sub);
    // await database.create(stateCreateHistory);

    output.json.result = result;

    /**
     * StateDeleter possible entities from the server store.
     */
    store.dispatch(coreActions.delete(result));

    return output;
  }
);

export const crudProcessDelete = mwAccess()(
  mwValidate('StateDeleter')(
    process,
  ),
);

export default { crudProcessDelete };
