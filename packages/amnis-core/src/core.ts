import { nanoid } from '@reduxjs/toolkit';
import {
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
export function grantString(grant: Grant): GrantString {
  if (grant.type === '@action') {
    return `@action:${grant.path}:${grant.scope}:${grant.task}`;
  }
  return `@select:${grant.path}:${grant.scope}:${grant.task}`;
}

export default {
  noop,
  reference,
  dateJSON,
  grantString,
  entityCreate,
  entityUpdate,
};
