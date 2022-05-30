import { nanoid } from '@reduxjs/toolkit';
import {
  DataScope,
  DateJSON, Entity, EntityExtension, EntityPartial, Grant, GrantFlag, GrantString, Reference,
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
export const reference = <T>(ref: string) => ref as Reference<T>;

/**
 * Creates an entity.
 */
export const entityCreate = <E extends Entity>(
  entity: EntityExtension<E>,
  creator?: Reference,
): E => {
  const now = dateJSON();
  const base: Entity = {
    $id: nanoid() as Reference,
    created: now,
    updated: now,
    $creator: creator || reference(''),
    $updaters: [],
    committed: false,
  };

  return {
    ...base,
    ...entity,
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
  const create: GrantFlag = grant.task.create ? '1' : '0';
  const read: GrantFlag = grant.task.read ? '1' : '0';
  const update: GrantFlag = grant.task.update ? '1' : '0';
  const del: GrantFlag = grant.task.delete ? '1' : '0';

  return `${grant.key}:${grant.scope}:${create},${read},${update},${del}`;
}

/**
 * Converts a grant string to a grant object.
 */
export function grantParse(grant: GrantString): Grant | undefined {
  const [key, scope, task] = grant.split(':');

  if (typeof task !== 'string') {
    return undefined;
  }

  const [create, read, update, del] = task.split(',');

  if (typeof key !== 'string') {
    return undefined;
  }

  if (typeof scope !== 'string') {
    return undefined;
  }

  if (!['global', 'owned'].includes(scope)) {
    return undefined;
  }

  return {
    key,
    scope: scope as DataScope,
    task: {
      create: create === '1',
      read: read === '1',
      update: update === '1',
      delete: del === '1',
    },
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
