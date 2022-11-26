import { uid } from '../../uid.js';
import {
  EntityCreator,
} from '../entity.types.js';
import { StateEntities, StateUpdater } from '../../state/index.js';
import { UID } from '../../types.js';
import type { History, HistoryBase, HistoryBaseCreate } from './history.types.js';
import { entityCreate } from '../entity.js';

export const historyKey = 'history';

export const historyBase: HistoryBase = {
  $subject: uid(historyKey),
  changes: {},
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
      const { $id, ...entityChanged } = entity;
      stateCreateHistory[historyKey].push(
        entityCreate<History>(
          historyKey,
          historyCreator({
            $subject: $id, // The entity being updates is the subject.
            changes: entityChanged, // The changes object.
          }),
          (creator ? { $creator: creator, committed } : { committed }),
        ),
      );
    });
    return true;
  });

  return stateCreateHistory;
}
