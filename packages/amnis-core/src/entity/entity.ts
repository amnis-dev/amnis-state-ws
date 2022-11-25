import type { UID } from '../types.js';
import type {
  Entity,
  EntityCreator,
  EntityExtension,
  EntityPartial,
  Meta,
} from './entity.types.js';
import { dateJSON } from '../core.js';
import { uidList, uid } from '../uid.js';
import { regexReference, regexUuid } from '../regex.js';

/**
 * Creates an entity.
 */
export const entityCreate = <E extends Entity>(
  key: string,
  entity: EntityExtension<E>,
  set?: Partial<Entity> | boolean,
): E => {
  const id = uid(key);
  const now = dateJSON();
  const base: Entity = {
    $id: id,
    created: now,
    updated: now,
    delete: false,
    $owner: id,
    $readers: uidList(),
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
export const entityKeys = Object.keys(entityCreate<Entity>('entity', {})).map((key) => key);

/**
 * Cleans and validates base entity keys and references for further processing.
 * TODO: This method can most certainly be made more efficient.
 */
export function entityClean(key: string, entity: Entity): EntityCreator<Entity> | undefined {
  let errored = false;
  const cleaned = Object.keys(entity)
    .reduce<Record<string, unknown>>((value, p) => {
    const prop = p as keyof Entity;
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
        /**
         * The property value being an array indicates that this is
         * a list or tree identification type.
         */
        if (Array.isArray(entity[prop])) {
          (entity[prop] as string[]).every((id: string | string[]) => {
            if (Array.isArray(id)) {
              if (!regexReference.test(id[0])) {
                errored = true;
                return false;
              }
              if (id[1] && !regexReference.test(id[1])) {
                errored = true;
                return false;
              }
            } else if (!regexReference.test(id)) {
              errored = true;
              return false;
            }
            return true;
          });
          /**
         * If the property value is not an array, it must sinply be an
         * identifier string.
         */
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

  return errored ? undefined : cleaned as EntityCreator<Entity>;
}

/**
 * Strips entity properties.
 */
export const entityStrip = <E extends Entity>(entity: E): EntityExtension<E> => {
  const result = Object.keys(entity).reduce<EntityExtension<E>>((entityNew, key) => {
    const k = key as keyof EntityExtension<E>;
    if (!entityKeys.includes(key)) {
      entityNew[k] = entity[k];
    }
    return entityNew;
  }, {} as EntityExtension<E>);

  return result;
};

/**
 * Strips an entity to a creator object.
 */
export const entityStripToCreator = <E extends Entity>(entity: E): EntityCreator<E> => {
  const result = Object.keys(entity).reduce<EntityCreator<E>>((entityNew, key) => {
    const k = key as keyof EntityCreator<E>;
    if (key === '$id' || !entityKeys.includes(key)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /** @ts-ignore */
      entityNew[k] = entity[k];
    }
    return entityNew;
  }, { $id: '' } as EntityCreator<E>);

  return result;
};

/**
 * Create meta information for an entity meta information.
 */
export function metaInitial<E extends Entity = Entity>(meta: Partial<Meta<E>> = {}): Meta<E> {
  return {
    active: null,
    focused: null,
    selection: [],
    original: {} as Record<UID<E>, E>,
    differences: {} as Record<UID<E>, (keyof E)[]>,
    ...meta,
  };
}
