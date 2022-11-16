import { uid } from '../uid.js';
import { EntityCreator, entityCreate } from '../entity/index.js';
import { StateEntities, StateUpdater } from '../state/index.js';
import { UID } from '../types.js';
import type { History, HistoryBase, HistoryBaseCreate } from './history.types.js';

export const historyKey = 'history';

export const historyBase: HistoryBase = {
  $subject: uid(historyKey),
  update: {
    $id: uid(''),
  },
};

export function historyCreator(
  history: HistoryBaseCreate,
): EntityCreator<History> {
  return {
    ...historyBase,
    ...history,
    $id: uid(historyKey),
  };
}
/**
 * Create historic records of the updates.
 */
export function historyMake(
  stateUpdate: StateUpdater,
  creator?: UID,
  deniedKeys?: string[],
  committed = false,
): StateEntities {
  const stateCreateHistory: StateEntities = {
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
        entityCreate<History>(
          historyKey,
          historyCreator({
            $subject: entity.$id, // The entity being updates is the subject.
            update: entity, // The update object.
          }),
          (creator ? { $creator: creator, committed } : { committed }),
        ),
      );
    });
    return true;
  });

  return stateCreateHistory;
}
