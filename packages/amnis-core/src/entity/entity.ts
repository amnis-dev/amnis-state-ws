import { nanoid } from 'nanoid';
import { dateJSON } from '../core';
import type { Reference } from '../core.types';
import type {
  Entity,
  EntityCreate,
  EntityUpdate,
} from './entity.types';

export function entityRef<E extends Entity>(id: string): Reference<E> {
  return id as Reference<E>;
}

export function entityCreate<E extends Entity>(
  entity: EntityCreate<E>,
  creator?: string,
): E {
  const now = dateJSON();
  const base: Entity = {
    id: nanoid(),
    dateCreated: now,
    dateUpdated: now,
    entityCreator: creator || null,
    entityUpdater: null,
    committed: false,
  };

  return {
    ...base,
    ...entity,
  } as E;
}

export function entityUpdate<E extends Entity>(
  entity: E,
  update: EntityUpdate<E>,
  updater?: string,
): E {
  const now = new Date().toJSON();
  return {
    ...entity,
    ...update,
    dateUpdated: now,
    entityUpdater: updater || null,
  };
}

export default { entityCreate };
