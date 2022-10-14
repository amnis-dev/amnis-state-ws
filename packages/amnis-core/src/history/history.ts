import { uid } from '../uid';
import { Entity, entityCreate } from '../entity';
import { StateCreate, StateUpdate } from '../state';
import { UID } from '../types';
import type { History, HistoryBase, HistoryBaseCreate } from './history.types';

export const historyKey = 'history';

export const historyBase: HistoryBase = {
  $subject: uid(historyKey),
  update: {
    $id: uid(''),
  },
};

export function historyCreate(
  history: HistoryBaseCreate,
  entity: Partial<Entity> = {},
): History {
  const historyEntity = entityCreate<History>(historyKey, {
    ...historyBase,
    ...history,
  }, entity);

  return historyEntity;
}
/**
 * Create historic records of the updates.
 */
export function historyMake(
  stateUpdate: StateUpdate,
  creator?: UID,
  deniedKeys?: string[],
): StateCreate {
  const stateCreateHistory: StateCreate = {
    [historyKey]: [],
  };
  Object.keys(stateUpdate).every((sliceKey) => {
    if (sliceKey === historyKey) {
      // Cannot create history of history.
      return true;
    }

    if (deniedKeys?.includes(sliceKey)) {
      return true;
    }

    const updateEntities = stateUpdate[sliceKey];
    updateEntities.forEach((entity) => {
      stateCreateHistory[historyKey].push(
        historyCreate(
          {
            $subject: entity.$id, // The entity being updates is the subject.
            update: entity, // The update object.
          },
          (creator ? { $creator: creator } : {}),
        ),
      );
    });
    return true;
  });

  return stateCreateHistory;
}
