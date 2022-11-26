import type {
  StateCreator, StateUpdater, StateDeleter, StateQuery,
} from '../state/index.js';

export interface Core {
  insert?: StateCreator,
  query?: StateQuery,
  modify?: StateUpdater,
  remove?: StateDeleter,
}
