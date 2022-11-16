import type { EntityCreator, EntityUpdate } from '../entity/index.js';

import type { Audit } from '../audit/index.js';
import type { Contact } from '../contact/index.js';
import type { Encryption } from '../encryption/index.js';
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

export interface StateCreator {
  audit?: EntityCreator<Audit>[];
  contact?: EntityCreator<Contact>[];
  encryption?: EntityCreator<Encryption>[];
  history?: EntityCreator<History>[];
  image?: EntityCreator<Image>[];
  locale?: EntityCreator<Locale>[];
  log?: EntityCreator<Log>[];
  note?: EntityCreator<Note>[];
  profile?: EntityCreator<Profile>[];
  role?: EntityCreator<Role>[];
  service?: EntityCreator<Service>[];
  system?: EntityCreator<System>[];
  user?: EntityCreator<User>[];
  session?: EntityCreator<Session>[];
  video?: EntityCreator<Video>[];
  website?: EntityCreator<Website>[];
}

export interface StateUpdater {
  audit?: EntityUpdate<Audit>[];
  contact?: EntityUpdate<Contact>[];
  encryption?: EntityUpdate<Encryption>[];
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
