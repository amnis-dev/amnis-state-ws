import {
  coreActions,
  dataInitial,
  IoContext, roleKey, StateCreate, systemKey, Validators,
} from '@amnis/core';
import { dbmemory } from '@amnis/db';
import { fsmemory } from '@amnis/fs';
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
    store, validators, database, filesystem, crypto, initialize, data,
  } = options;
  const storeNext = store ?? storeDefault;
  const validatorsNext = (validators || []) as Validators;
  const databaseNext = database ?? dbmemory;
  const filesystemNext = filesystem ?? fsmemory;
  const dataNext = data ?? dataInitial();

  const cryptoNext = crypto ?? await (async () => {
    if (typeof process === 'object') {
      const result = await import('@amnis/crypto');
      return result.cryptoNode;
    }
    const result = await import('@amnis/crypto/browser');
    return result.cryptoBrowser;
  })();

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
    filesystem: filesystemNext,
    crypto: cryptoNext,
  };
}

export default contextSetup;
