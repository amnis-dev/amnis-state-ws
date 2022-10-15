import type {
  StateCreate, StateUpdate, StateDelete, StateQuery,
} from './state/index.js';

export interface Core {
  insert?: StateCreate,
  query?: StateQuery,
  modify?: StateUpdate,
  remove?: StateDelete,
}
