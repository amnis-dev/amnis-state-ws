import { nanoid } from '@reduxjs/toolkit';
import {
  DataScope,
  DataTask,
  DateJSON, Entity, EntityExtension, EntityPartial, Grant, GrantString, Reference,
} from './types';

/**
 * Function for no operation.
 */
export const noop = () => { /** No operation. */ };

/**
 * Create a Date JSON string type.
 */
export const dateJSON = () => (new Date().toJSON() as DateJSON);

/**
 * Create a reference to another type.
 */
export const reference = <T>(key: string, id: string) => `${key}:${id}` as Reference<T>;

/**
 * Validates a reference type.
 */
export const referenceValidate = (ref: string): boolean => {
  const [key, id] = ref.split(':');

  if (!key || typeof key !== 'string') {
    return false;
  }

  if (!id || typeof id !== 'string' || id.length !== 21) {
    return false;
  }

  return true;
};

/**
 * Creates an entity.
 */
export const entityCreate = <E extends Entity>(
  key: string,
  entity: EntityExtension<E>,
  set?: Partial<Entity>,
): E => {
  const now = dateJSON();
  const base: Entity = {
    $id: `${key}:${nanoid()}` as Reference,
    created: now,
    updated: now,
    $owner: reference('user', ''),
    $creator: reference('user', ''),
    $updaters: [],
    committed: false,
  };

  return {
    ...base,
    ...entity,
    ...set,
  } as E;
};

/**
 * Modifies an entity.
 */
export const entityUpdate = <E extends Entity>(
  target: E,
  modification: EntityPartial<E>,
  updater?: Reference,
): E => {
  const now = new Date().toJSON();
  const result: E = {
    ...target,
    ...modification,
    updated: now,
  };
  if (updater) {
    result.$updaters.push(updater);
  }
  return result;
};

/**
 * Converts a grant to string format.
 */
export function grantStringify(grant: Grant): GrantString {
  return `${grant.key}:${grant.scope}:${grant.task}`;
}

/**
 * Converts a grant string to a grant object.
 */
export function grantParse(grant: GrantString): Grant | undefined {
  const [key, scope, task] = grant.split(':');

  if (typeof key !== 'string') {
    return undefined;
  }

  if (typeof scope !== 'string') {
    return undefined;
  }

  if (!['global', 'owned'].includes(scope)) {
    return undefined;
  }

  const taskValue: DataTask = parseInt(task, 10);

  if (typeof taskValue !== 'number') {
    return undefined;
  }

  if (taskValue < 0 || taskValue > 15) {
    return undefined;
  }

  return {
    key,
    scope: scope as DataScope,
    task: taskValue,
  };
}

export default {
  noop,
  reference,
  dateJSON,
  grantStringify,
  grantParse,
  entityCreate,
  entityUpdate,
};
