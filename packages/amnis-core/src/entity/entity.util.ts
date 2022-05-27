import { nanoid } from 'nanoid';
import type { Reference, Entity } from '../core.types';
import { dateJSON } from '../core';
import type {
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
    $id: nanoid() as Reference,
    created: now,
    updated: now,
    $creator: entityRef(creator || ''),
    $updaters: [],
    $licenses: [],
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

export default { entityRef, entityCreate, entityUpdate };
