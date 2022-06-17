import type {
  EntityCreate,
  EntityUpdate,
} from '@amnis/core/index';
import type { User } from './user/user.types';
import type { Session } from './session/session.types';
import type { Role } from './role/role.types';
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
