import { coreActions } from '@amnis/core/actions';
import { initialCoreState } from '@amnis/core/initial';
import type { Database } from '@amnis/db/index';
import type { Store } from '@reduxjs/toolkit';

/**
 * Initializes a service by collecting configurations from a database.
 * If no configuration data is found, initializes base data.
 */
export async function serviceInitialize(
  store: Store,
  database: Database,
  systemName: string,
  initialState = initialCoreState,
) {
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
    store.dispatch(coreActions.create(initialState));
  }
}

export default { serviceInitialize };
