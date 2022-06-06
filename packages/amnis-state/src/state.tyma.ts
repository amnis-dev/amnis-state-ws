import type { User } from '@amnis/core/index';

export interface State {
  user?: User[];
}

export interface StatePartial {
  user?: Partial<User>[];
}
