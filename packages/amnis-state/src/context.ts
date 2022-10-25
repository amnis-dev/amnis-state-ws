import {
  coreActions,
  IoContext, roleKey, StateCreate, systemKey, Validators,
} from '@amnis/core';
import { memory } from '@amnis/db';
import { dataInitial } from './data.js';
import { store as storeDefault } from './store.js';
import { systemActions } from './system/index.js';

export interface ContextOptions extends Partial<IoContext> {
  /**
   * Initializes with default data (if not already set)
   */
  initialize?: boolean | 'database';

  /**
   * Set initial entity data.
   */
  data?: StateCreate;
}

/**
 * Initializes a service context with optional parameters.
 */
export async function contextSetup(options: ContextOptions = {}): Promise<IoContext> {
  const {
    store, validators, database, initialize, data,
  } = options;
  const storeNext = store ?? storeDefault;
  const validatorsNext = (validators || []) as Validators;
  const databaseNext = database ?? memory;
  const dataNext = data ?? dataInitial();

  if (initialize) {
    const readResult = await databaseNext.read({
      [systemKey]: {},
      [roleKey]: {},
    });

    /**
   * Initialize the system if one isn't found.
   */
    if (!readResult[systemKey]?.length) {
      const createResult = await databaseNext.create(dataNext);

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

export default contextSetup;
