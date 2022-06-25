import type {
  EntityCreate,
  EntityUpdate,
  User,
  Role,
  Session,
  Profile,
} from '@amnis/core/index';

export interface StateCreate {
  user?: EntityCreate<User>[];
  role?: EntityCreate<Role>[];
  session?: EntityCreate<Session>[];
  profile?: EntityCreate<Profile>[];
}

export interface StateUpdate {
  user?: EntityUpdate<User>[];
  role?: EntityUpdate<Role>[];
  session?: EntityUpdate<Session>[];
  profile?: EntityUpdate<Profile>[];
}
