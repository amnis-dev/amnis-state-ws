import { nanoid } from '@reduxjs/toolkit';
import { dateJSON } from '../core';
import { regexReference, regexUuid } from '../regex';
import type {
  Identifier,
} from '../types';
import type {
  Entity,
  EntityExtension,
  EntityPartial,
} from './entity.types';

/**
 * Creates an entity.
 */
export const entityCreate = <E extends Entity>(
  key: string,
  entity: EntityExtension<E>,
  set?: Partial<Entity> | boolean,
): E => {
  const id = `${key}:${nanoid()}` as Identifier;
  const now = dateJSON();
  const base: Entity = {
    $id: id,
    created: now,
    updated: now,
    delete: false,
    $owner: id,
    $readers: [],
    $creator: id,
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
): E => {
  const now = new Date().toJSON();
  const result: E = {
    ...target,
    ...modification,
    updated: now,
  };
  return result;
};

/**
 * Array of entity prop keys.
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
        if (sKey === key && regexUuid.test(id)) {
          value[prop] = entity[prop];
        } else {
          errored = true;
        }
      /**
       * Only references/identifier arrays begin with a '$' character.
       * Also enure they have valid ids.
       */
      } else if (prop.charAt(0) === '$') {
        if (Array.isArray(entity[prop])) {
          (entity[prop] as string[]).every((id: string) => {
            if (!regexReference.test(id)) {
              errored = true;
              return false;
            }
            return true;
          });
        } else if (!regexReference.test(entity[prop] as string)) {
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

/**
 * ReIds an array of entities.
 */
// export function reIdentify(entities: Entity[], reids: ReID[] | undefined): Entity[] {
//   const reIdEntities = entities.map((entity) => {
//     const reidsChecked = reids || [];
//     const reid = reidsChecked.find((value) => (value[0] === entity.$id));
//     if (reid) {
//       return { ...entity, $id: reid[1] };
//     }
//     return entity;
//   });
//   return reIdEntities;
// }
