import type {
  EntityCreate,
  EntityUpdate,
  User,
  Role,
  Session,
} from '@amnis/core/index';

export interface StateCreate {
  user?: EntityCreate<User>[];
  role?: EntityCreate<Role>[];
  session?: EntityCreate<Session>[];
}

export interface StateUpdate {
  user?: EntityUpdate<User>[];
  role?: EntityUpdate<Role>[];
  session?: EntityUpdate<Session>[];
}
