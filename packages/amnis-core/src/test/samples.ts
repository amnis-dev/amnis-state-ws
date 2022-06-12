import {
  hashSync,
} from 'bcrypt';
import type {
  Role,
  User,
} from '../types';
import {
  entityCreate,
  grantStringify,
  task,
} from '../core';

function passCreateSync(plaintext: string): string {
  return hashSync(plaintext, 8);
}

const roles: Role[] = [
  entityCreate<Role>('role', {
    name: 'Base',
    description: 'Most basic role assigned to all registered users.',
    color: '#000000',
    grants: [
      grantStringify({ key: 'user', scope: 'owned', task: task(0, 1, 1, 0) }),
    ],
  }),
  entityCreate<Role>('role', {
    name: 'Moderator',
    description: 'A role that allows limited administration.',
    color: '#00cccc',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(0, 1, 1, 0) }),
    ],
  }),
  entityCreate<Role>('role', {
    name: 'Administrator',
    description: 'Most permissive role for complete administration.',
    color: '#cc0000',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(1, 1, 1, 1) }),
      grantStringify({ key: 'role', scope: 'global', task: task(1, 1, 1, 1) }),
    ],
  }),
];

const users: User[] = [
  entityCreate('user', {
    name: 'Normie',
    email: 'normy@ecrow.dev',
    password: passCreateSync('passwd1'),
    $roles: [roles[0].$id],
    $permits: [],
  }),
  entityCreate('user', {
    name: 'Moddie',
    email: 'moddie@ecrow.dev',
    password: passCreateSync('passwd2'),
    $roles: [roles[1].$id],
    $permits: [],
  }),
  entityCreate('user', {
    name: 'Admy',
    email: 'admy@ecrow.dev',
    password: passCreateSync('passwd3'),
    $roles: [roles[2].$id],
    $permits: [],
  }),
];

export const samples = { roles, users };

export default samples;
