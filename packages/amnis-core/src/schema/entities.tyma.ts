import type {
  Audit,
  Contact,
  Credential,
  Handle,
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
  EntityUpdater,
} from '../entity/index.js';

export interface StateCreator {
  audit?: Audit[];
  contact?: Contact[];
  credential?: Credential[];
  handle?: Handle[];
  history?: History[];
  image?: Image[];
  locale?: Locale[];
  log?: Log[];
  note?: Note[];
  profile?: Profile[];
  role?: Role[];
  service?: Service[];
  system?: System[];
  user?: User[];
  session?: Session[];
  video?: Video[];
  website?: Website[];
}

export interface StateUpdater {
  audit?: EntityUpdater<Audit>[];
  contact?: EntityUpdater<Contact>[];
  credential?: EntityUpdater<Credential>[];
  history?: EntityUpdater<History>[];
  image?: EntityUpdater<Image>[];
  locale?: EntityUpdater<Locale>[];
  log?: EntityUpdater<Log>[];
  note?: EntityUpdater<Note>[];
  profile?: EntityUpdater<Profile>[];
  role?: EntityUpdater<Role>[];
  service?: EntityUpdater<Service>[];
  system?: EntityUpdater<System>[];
  user?: EntityUpdater<User>[];
  session?: EntityUpdater<Session>[];
  video?: EntityUpdater<Video>[];
  website?: EntityUpdater<Website>[];
}
