import { nanoid } from 'nanoid';
import type {
  Entity,
  EntityCreate,
  EntityUpdate,
} from './entity.types';

export function entityCreate<E extends Entity>(
  entity: EntityCreate<E>,
  creator?: string,
): E {
  const now = new Date().toJSON();
  return {
    id: nanoid(),
    dateCreated: now,
    dateUpdated: now,
    entityCreator: creator || null,
    entityUpdater: null,
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
