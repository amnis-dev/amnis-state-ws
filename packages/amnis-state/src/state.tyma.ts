import type { EntityCreate, EntityUpdate } from '@amnis/core/entity';

import type { Contact } from '@amnis/core/contact/index';
import type { Log } from '@amnis/core/log/index';
import type { Profile } from '@amnis/core/profile/index';
import type { Role } from '@amnis/core/role/index';
import type { Session } from '@amnis/core/session/index';
import type { System } from '@amnis/core/system/index';
import type { User } from '@amnis/core/user/index';
import type { Website } from '@amnis/core/website/index';

export interface StateCreate {
  contact?: EntityCreate<Contact>[];
  log?: EntityCreate<Log>[];
  profile?: EntityCreate<Profile>[];
  role?: EntityCreate<Role>[];
  system?: EntityCreate<System>[];
  user?: EntityCreate<User>[];
  session?: EntityCreate<Session>[];
  website?: EntityCreate<Website>[];
}

export interface StateUpdate {
  contact?: EntityUpdate<Contact>[];
  log?: EntityUpdate<Log>[];
  profile?: EntityUpdate<Profile>[];
  role?: EntityUpdate<Role>[];
  system?: EntityUpdate<System>[];
  user?: EntityUpdate<User>[];
  session?: EntityUpdate<Session>[];
  website?: EntityUpdate<Website>[];
}
