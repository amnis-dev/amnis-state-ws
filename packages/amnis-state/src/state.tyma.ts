import type { EntityCreate, EntityUpdate } from '@amnis/core/entity/index.js';

import type { Contact } from '@amnis/core/contact/index.js';
import type { Log } from '@amnis/core/log/index.js';
import type { Profile } from '@amnis/core/profile/index.js';
import type { Role } from '@amnis/core/role/index.js';
import type { Session } from '@amnis/core/session/index.js';
import type { System } from '@amnis/core/system/index.js';
import type { User } from '@amnis/core/user/index.js';
import type { Website } from '@amnis/core/website/index.js';

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
