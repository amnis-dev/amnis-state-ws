import type { EntityCreate, EntityUpdate } from '../entity/index.js';

import type { Audit } from '../audit/index.js';
import type { Contact } from '../contact/index.js';
import type { Crypto } from '../crypto/index.js';
import type { History } from '../history/index.js';
import type { Image } from '../image/index.js';
import type { Locale } from '../locale/index.js';
import type { Log } from '../log/index.js';
import type { Note } from '../note/index.js';
import type { Profile } from '../profile/index.js';
import type { Role } from '../role/index.js';
import type { Service } from '../service/index.js';
import type { Session } from '../session/index.js';
import type { System } from '../system/index.js';
import type { User } from '../user/index.js';
import type { Video } from '../video/index.js';
import type { Website } from '../website/index.js';

export interface StateCreate {
  audit?: EntityCreate<Audit>[];
  contact?: EntityCreate<Contact>[];
  crypto?: EntityCreate<Crypto>[];
  history?: EntityCreate<History>[];
  image?: EntityCreate<Image>[];
  locale?: EntityCreate<Locale>[];
  log?: EntityCreate<Log>[];
  note?: EntityCreate<Note>[];
  profile?: EntityCreate<Profile>[];
  role?: EntityCreate<Role>[];
  service?: EntityCreate<Service>[];
  system?: EntityCreate<System>[];
  user?: EntityCreate<User>[];
  session?: EntityCreate<Session>[];
  video?: EntityCreate<Video>[];
  website?: EntityCreate<Website>[];
}

export interface StateUpdate {
  audit?: EntityUpdate<Audit>[];
  contact?: EntityUpdate<Contact>[];
  crypto?: EntityUpdate<Crypto>[];
  history?: EntityUpdate<History>[];
  image?: EntityUpdate<Image>[];
  locale?: EntityUpdate<Locale>[];
  log?: EntityUpdate<Log>[];
  note?: EntityUpdate<Note>[];
  profile?: EntityUpdate<Profile>[];
  role?: EntityUpdate<Role>[];
  service?: EntityUpdate<Service>[];
  system?: EntityUpdate<System>[];
  user?: EntityUpdate<User>[];
  session?: EntityUpdate<Session>[];
  video?: EntityUpdate<Video>[];
  website?: EntityUpdate<Website>[];
}
