import { coreActions } from '@amnis/core/actions.js';
import { coreInitialState } from '@amnis/core/initial.js';
import { StateCreate } from '@amnis/core/state/index.js';
import type { Database } from '@amnis/core/db.types.js';
import type { Store } from '@reduxjs/toolkit/index.js';
import { System, systemActions } from '../system/index.js';

/**
 * Initializes a system by collecting configurations from a database.
 * If no configuration data is found, initializes base data.
 */
export async function systemInitialize(
  store: Store,
  database: Database,
  systemName: string,
  initialState?: StateCreate,
) {
  const initial = initialState || coreInitialState(systemName);

  const systemReadResult = await database.read({
    system: {
      $query: {
        name: {
          $eq: systemName,
        },
      },
    },
  });

  const systemId = systemReadResult.system?.[0]?.$id;

  if (!systemId) {
    database.create(initial);
    store.dispatch(coreActions.create(initial));
    const system = initial.system?.[0] as System;

    if (!system) {
      throw new Error('A system must be defined in the initial system state!');
    }

    store.dispatch(systemActions.activeSet(system.$id));
  }
}

export default { systemInitialize };
