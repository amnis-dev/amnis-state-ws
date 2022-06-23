import { nanoid } from '@reduxjs/toolkit';
import { dateJSON, reference } from './core';
import type {
  Entity,
  EntityExtension,
  EntityPartial,
  Reference,
} from './types';

/**
 * Default identifier.
 */
const idDefault = nanoid();

/**
 * Creates an entity.
 */
export const entityCreate = <E extends Entity>(
  key: string,
  entity: EntityExtension<E>,
  set?: Partial<Entity> | boolean,
): E => {
  const systemKey = 'system';
  const id = `${key}:${nanoid()}` as Reference;
  const now = dateJSON();
  const base: Entity = {
    $id: id,
    created: now,
    updated: now,
    delete: false,
    $owner: reference(systemKey, idDefault),
    $creator: reference(systemKey, idDefault),
    $updaters: [],
    committed: false,
  };

  const overwrite: Partial<Entity> = typeof set === 'boolean' ? {
    $owner: id,
  } : set || {};

  return {
    ...base,
    ...entity,
    ...overwrite,
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
 * Array of entity keys.
 */
const entityKeys = Object.keys(entityCreate<Entity>('entity', {})).map((key) => key);

/**
 * Cleans and validates base entity keys and references for further processing.
 * TODO: This method can most certainly be made more efficient.
 */
export function entityClean(key: string, entity: Record<string, unknown>) {
  let errored = false;
  const cleaned = Object.keys(entity).reduce<Record<string, unknown>>((value, prop) => {
    if (prop === '$id' || !entityKeys.includes(prop)) {
      if (prop === '$id') {
        const [sKey, id] = (entity[prop] as string).split(':');
        if (sKey === key && /^[A-Za-z0-9_-]{21,36}/.test(id)) {
          value[prop] = entity[prop];
        } else {
          errored = true;
        }
      /**
       * Only references/reference arrays begin with a '$' character.
       * Also enure they have valid ids.
       */
      } else if (prop.charAt(0) === '$') {
        if (Array.isArray(entity[prop])) {
          (entity[prop] as string[]).every((id: string) => {
            if (!/^[A-Za-z0-9_:-]{21,36}/.test(id)) {
              errored = true;
              return false;
            }
            return true;
          });
        } else if (!/^[A-Za-z0-9_:-]{21,36}/.test(entity[prop] as string)) {
          errored = true;
        }
        value[prop] = entity[prop];
      } else {
        value[prop] = entity[prop];
      }
    }
    return value;
  }, {});

  return errored ? undefined : cleaned;
}

export default {
  entityCreate,
  entityUpdate,
  entityClean,
};
