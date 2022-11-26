import {
  coreActions,
  databaseMemory,
  dataInitial,
  filesystemMemory,
  IoContext,
  roleKey,
  StateEntities,
  systemKey,
  Validators,
} from '@amnis/core';
import { cryptoWeb } from '@amnis/crypto';
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
  data?: StateEntities;
}

/**
 * Initializes a service context with optional parameters.
 */
export async function contextSetup(options: ContextOptions = {}): Promise<IoContext> {
  const {
    store, validators, database, filesystem, crypto, initialize, data,
  } = options;
  const storeNext = store ?? storeDefault;
  const validatorsNext = (validators || []) as Validators;
  const databaseNext = database ?? databaseMemory;
  const filesystemNext = filesystem ?? filesystemMemory;
  const dataNext = data ?? dataInitial();

  const cryptoNext = crypto ?? cryptoWeb;

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
        const serviceResult: StateEntities = {
          [systemKey]: createResult[systemKey],
          [roleKey]: createResult[roleKey],
        };
        storeNext.dispatch(coreActions.insert(serviceResult));
        storeNext.dispatch(systemActions.activeSet(system.$id));
      }
    } else if (initialize === true) {
      const system = readResult[systemKey][0];
      const serviceResult: StateEntities = {
        [systemKey]: readResult[systemKey],
        [roleKey]: readResult[roleKey],
      };
      storeNext.dispatch(coreActions.insert(serviceResult));
      storeNext.dispatch(systemActions.activeSet(system.$id));
    }
  }

  return {
    store: storeNext,
    validators: validatorsNext,
    database: databaseNext,
    filesystem: filesystemNext,
    crypto: cryptoNext,
  };
}

export default contextSetup;
