import type {
  EntityCreate,
  EntityUpdate,
  User,
  Role,
  Session,
} from '@amnis/core/index';
import type { Profile } from './profile/profile.types';

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
