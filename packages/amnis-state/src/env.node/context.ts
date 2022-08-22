import type { ApiContext, Validators } from '@amnis/api/index.node';
import {
  coreActions, roleKey, StateCreate, systemKey,
} from '@amnis/core/index.node';
import { memory } from '@amnis/db/memory';

import { initialState } from './initial';
import { store as storeDefault } from './store';
import { systemActions } from '../system';

export interface ContextOptions extends Partial<ApiContext> {
  initial?: StateCreate;
}

/**
 * Initializes a service context with optional parameters.
 */
export async function contextCreate(options: ContextOptions = {}): Promise<ApiContext> {
  const {
    store, validators, database, initial,
  } = options;
  const storeNext = store ?? storeDefault;
  const validatorsNext = (validators || []) as Validators;
  const databaseNext = database ?? memory;
  const initialNext = initial ?? initialState();

  const readResult = await databaseNext.read({
    [systemKey]: {},
    [roleKey]: {},
  });

  /**
   * Initialize the system if one isn't found.
   */
  if (!readResult[systemKey]?.length) {
    const createResult = await databaseNext.create(initialNext);
    const system = createResult[systemKey][0];
    storeNext.dispatch(coreActions.create(createResult));
    storeNext.dispatch(systemActions.activeSet(system.$id));
  } else {
    const system = readResult[systemKey][0];
    storeNext.dispatch(coreActions.create(readResult));
    storeNext.dispatch(systemActions.activeSet(system.$id));
  }

  return {
    store: storeNext,
    validators: validatorsNext,
    database: databaseNext,
  };
}

export default contextCreate;
