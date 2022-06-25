import {
  hashSync,
} from 'bcrypt';
import type {
  Role,
  User,
  Profile,
} from '../types';
import {
  grantStringify,
  task,
} from '../grant';
import {
  entityCreate,
} from '../entity';
import { userCreate } from '../user';

function passCreateSync(plaintext: string): string {
  return hashSync(plaintext, 8);
}

const roles: Role[] = [
  entityCreate<Role>('role', {
    name: 'Base',
    description: 'Most basic role assigned to all registered users.',
    color: '#000000',
    grants: [
      grantStringify({ key: 'user', scope: 'owned', task: task(0, 1, 0, 0) }),
      grantStringify({ key: 'profile', scope: 'owned', task: task(0, 1, 1, 0) }),
      grantStringify({ key: 'profile', scope: 'global', task: task(0, 1, 0, 0) }),
    ],
  }),
  entityCreate<Role>('role', {
    name: 'Moderator',
    description: 'A role that allows limited administration.',
    color: '#00cccc',
    grants: [
      grantStringify({ key: 'user', scope: 'owned', task: task(0, 1, 1, 0) }),
      grantStringify({ key: 'user', scope: 'global', task: task(0, 1, 0, 0) }),
      grantStringify({ key: 'profile', scope: 'global', task: task(0, 1, 1, 0) }),
    ],
  }),
  entityCreate<Role>('role', {
    name: 'Administrator',
    description: 'Most permissive role for complete administration.',
    color: '#cc0000',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(1, 1, 1, 1) }),
      grantStringify({ key: 'role', scope: 'global', task: task(1, 1, 1, 1) }),
      grantStringify({ key: 'profile', scope: 'global', task: task(1, 1, 1, 1) }),
    ],
  }),
];

const users: User[] = [
  userCreate({
    name: 'Normie',
    email: 'normy@ecrow.dev',
    phone: '',
    password: passCreateSync('passwd1'),
    $roles: [roles[0].$id],
    $permits: [],
  })[0],
  userCreate({
    name: 'Moddie',
    email: 'moddie@ecrow.dev',
    phone: '',
    password: passCreateSync('passwd2'),
    $roles: [roles[1].$id],
    $permits: [],
  })[0],
  userCreate({
    name: 'Admy',
    email: 'admy@ecrow.dev',
    password: passCreateSync('passwd3'),
    $roles: [roles[2].$id],
    $permits: [],
  })[0],
];

const profiles: Profile[] = [
  entityCreate<Profile>('profile', {
    $user: users[0].$id,
    nameDisplay: 'Normie',
    nameGiven: 'Normal',
    nameFamily: 'McProfile',
  }, { $owner: users[0].$id }),
  entityCreate<Profile>('profile', {
    $user: users[1].$id,
    nameDisplay: 'Moddie',
    nameGiven: 'Moderator',
    nameFamily: 'McProfile',
  }, { $owner: users[1].$id }),
  entityCreate<Profile>('profile', {
    $user: users[2].$id,
    nameDisplay: 'Admy',
    nameGiven: 'Administrator',
    nameFamily: 'McProfile',
  }, { $owner: users[2].$id }),
];

export const samples = { roles, users, profiles };

export default samples;
