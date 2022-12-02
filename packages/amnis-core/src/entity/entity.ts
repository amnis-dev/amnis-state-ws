import type { UID } from '../types.js';
import type {
  Entity,
  EntityCreator,
  Meta,
} from './entity.types.js';
import { dateJSON } from '../core.js';
import { uid, uidList } from '../uid.js';
import { regexReference, regexUuid } from '../regex.js';

/**
 * Creates an entity.
 */
export const entityCreate = <C extends EntityCreator>(
  creator: C,
  set?: Partial<Entity<C>> | boolean,
): Entity<C> => {
  const id = creator.$id as UID<C>;
  const now = dateJSON();
  const entity: Entity = {
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
    ...entity,
    ...creator,
    ...overwrite,
  } as Entity<C>;
};

/**
 * Modifies an entity.
 */
export const entityUpdate = <
  C extends EntityCreator,
  E extends Entity<C>
>(
  target: E,
  modification: Partial<E>,
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
export const entityKeys: (keyof Entity)[] = Object.keys(
  entityCreate({
    $id: uid('entity'),
  }),
).map((key) => key as keyof Entity);

/**
 * Cleans and validates base entity keys and references for further processing.
 * TODO: This method can most certainly be made more efficient.
 */
export function entityClean<C extends EntityCreator>(
  key: string,
  entity: Entity<C>,
): C | undefined {
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

  return errored ? undefined : cleaned as C;
}

/**
 * Strips an entity to a creator object.
 */
export const entityStrip = <C extends EntityCreator>(
  entity: Entity<C>,
): C => {
  const result = Object.keys(entity).reduce<C>((entityNew, key) => {
    const k = key as keyof Entity;
    if (k === '$id' || !entityKeys.includes(k)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /** @ts-ignore */
      entityNew[k] = entity[k];
    }
    return entityNew;
  }, { $id: '' } as C);

  return result;
};

/**
 * Create meta information for an entity meta information.
 */
export function metaInitial<C extends EntityCreator>(
  meta: Partial<Meta<C>> = {},
): Meta<C> {
  return {
    active: null,
    focused: null,
    selection: [],
    original: {} as Record<UID<Entity<C>>, Entity<C>>,
    differences: {} as Record<UID<Entity<C>>, (keyof Entity<C>)[]>,
    ...meta,
  };
}
