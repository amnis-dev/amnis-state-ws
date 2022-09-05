import { dateJSON } from '../core';
import { Entity, entityCreate } from '../entity';
import type { History, HistoryBase, HistoryBaseCreate } from './history.types';

export const historyKey = 'history';

export const historyBase: HistoryBase = {
  update: {},
  date: dateJSON(),
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
