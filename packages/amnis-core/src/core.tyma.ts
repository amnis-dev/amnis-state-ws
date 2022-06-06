import {
  Insert, Modify, Remove, Select,
} from './types';

export interface Core {
  insert?: Insert,
  select?: Select,
  modify?: Modify,
  remove?: Remove,
}
