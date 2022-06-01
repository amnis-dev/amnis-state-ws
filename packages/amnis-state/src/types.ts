import type { User, Session } from '@amnis/core/index';

export interface StateComplete {
  user?: User[];
  session?: Session[];
}

export interface StatePartial {
  user?: Partial<User>[];
  session?: Partial<Session>[];
}
