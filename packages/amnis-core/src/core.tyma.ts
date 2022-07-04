import {
  StateCreate, StateUpdate, StateDelete, StateQuery,
} from './state';

export interface Core {
  insert?: StateCreate,
  query?: StateQuery,
  modify?: StateUpdate,
  remove?: StateDelete,
}
