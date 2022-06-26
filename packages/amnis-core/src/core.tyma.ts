import {
  Insert, Modify, Remove, Select,
} from './state';

export interface Core {
  insert?: Insert,
  select?: Select,
  modify?: Modify,
  remove?: Remove,
}
