import { nanoid } from 'nanoid';
import type {
  Entity,
  EntityCreate,
  EntityUpdate,
} from './entity.types';

export function entityCreate<E extends Entity>(entity?: EntityCreate<E>): E {
  const now = new Date().toJSON();
  return {
    id: nanoid(),
    dateCreated: now,
    dateUpdated: now,
    ...entity,
  } as E;
}

export function entityUpdate<E extends Entity>(entity: E, update: EntityUpdate<E>): E {
  const now = new Date().toJSON();
  return {
    ...entity,
    ...update,
    dateUpdated: now,
  } as E;
}

export default { entityCreate };
