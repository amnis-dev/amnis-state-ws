import type { User } from '@amnis/core/index';

export interface StateComplete {
  user?: User[];
}

export interface StatePartial {
  user?: Partial<User>[];
}
