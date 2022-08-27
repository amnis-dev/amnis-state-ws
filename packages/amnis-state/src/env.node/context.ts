import type { ApiContext, Validators } from '@amnis/api/index.node';
import {
  coreActions, roleKey, StateCreate, systemKey,
} from '@amnis/core/index.node';
import { memory } from '@amnis/db/memory';

import { entitiesInitial } from './entities';
import { store as storeDefault } from './store';
import { systemActions } from '../system';

export interface ContextOptions extends Partial<ApiContext> {
  /**
   * Initializes with default data (if not already set)
   */
  initialize?: boolean | 'database';

  /**
   * Set initial entity data.
   */
  entities?: StateCreate;
}

/**
 * Initializes a service context with optional parameters.
 */
export async function contextCreate(options: ContextOptions = {}): Promise<ApiContext> {
  const {
    store, validators, database, initialize, entities,
  } = options;
  const storeNext = store ?? storeDefault;
  const validatorsNext = (validators || []) as Validators;
  const databaseNext = database ?? memory;
  const entitiesNext = entities ?? entitiesInitial();

  if (initialize) {
    const readResult = await databaseNext.read({
      [systemKey]: {},
      [roleKey]: {},
    });

    /**
   * Initialize the system if one isn't found.
   */
    if (!readResult[systemKey]?.length) {
      const createResult = await databaseNext.create(entitiesNext);

      if (initialize === true) {
        const system = createResult[systemKey][0];
        const serviceResult: StateCreate = {
          [systemKey]: createResult[systemKey],
          [roleKey]: createResult[roleKey],
        };
        storeNext.dispatch(coreActions.create(serviceResult));
        storeNext.dispatch(systemActions.activeSet(system.$id));
      }
    } else if (initialize === true) {
      const system = readResult[systemKey][0];
      const serviceResult: StateCreate = {
        [systemKey]: readResult[systemKey],
        [roleKey]: readResult[roleKey],
      };
      storeNext.dispatch(coreActions.create(serviceResult));
      storeNext.dispatch(systemActions.activeSet(system.$id));
    }
  }

  return {
    store: storeNext,
    validators: validatorsNext,
    database: databaseNext,
  };
}

export default contextCreate;
