import type {
  Audit,
  Contact,
  History,
  Image,
  Locale,
  Log,
  Note,
  Profile,
  Role,
  Service,
  System,
  Session,
  User,
  Video,
  Website,
  EntityCreator,
  EntityUpdate,
} from '../entity/index.js';

export interface StateCreator {
  audit?: EntityCreator<Audit>[];
  contact?: EntityCreator<Contact>[];
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
