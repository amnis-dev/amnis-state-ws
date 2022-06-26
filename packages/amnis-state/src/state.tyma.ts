import type { EntityCreate, EntityUpdate } from '@amnis/core/entity';
import type { Profile } from '@amnis/core/profile';
import type { Role } from '@amnis/core/role';
import type { Session } from '@amnis/core/session';
import type { User } from '@amnis/core/user';

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
