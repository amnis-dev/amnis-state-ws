/* eslint-disable @typescript-eslint/no-explicit-any */
import { uid } from '../../uid.js';
import { GrantTask } from '../../state/index.js';
import type { UID } from '../../types.js';
import type {
  History, HistoryBase, HistoryCreator, HistoryStateMutator,
} from './history.types.js';

export const historyKey = 'history';

export const historyBase = (): HistoryBase => ({
  $subject: uid(historyKey, 'null'),
  task: GrantTask.None,
  mutation: null,
});

export function historyCreator(
  history: HistoryCreator,
): History {
  return {
    ...historyBase(),
    ...history,
    $id: uid(historyKey),
  };
}
/**
 * Create historic records of state mutations.
 */
export function historyMake(
  state: HistoryStateMutator,
  task: GrantTask,
): History[] {
  const histories: History[] = [];

  Object.values(state).forEach((mutators) => {
    mutators.forEach((mutation: any) => {
      const $subject: UID = typeof mutation === 'object' ? mutation?.$id : mutation;
      histories.push(historyCreator({
        $subject,
        task,
        mutation,
      }));
    });
  });

  return histories;
}
