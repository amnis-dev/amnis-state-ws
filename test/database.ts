import { entityCreate, grantStringify, task } from '@amnis/core/core';
import { passCreateSync } from '@amnis/auth/index';
import { memory } from '@amnis/db/memory';
import { roleKey, userKey } from '@amnis/state/index';
import { Role, User } from '@amnis/state/types';

const roles: Role[] = [
  entityCreate<Role>(roleKey, {
    name: 'Base',
    description: 'Most basic role assigned to all registered users.',
    color: '#000000',
    grants: [
      grantStringify({ key: 'user', scope: 'owned', task: task(0, 1, 1, 0) }),
    ],
  }),
  entityCreate<Role>(roleKey, {
    name: 'Moderator',
    description: 'Most basic role assigned to all registered users.',
    color: '#00cccc',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(0, 1, 1, 0) }),
    ],
  }),
  entityCreate<Role>(roleKey, {
    name: 'Administrator',
    description: 'Most basic role assigned to all registered users.',
    color: '#cc0000',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(1, 1, 1, 1) }),
      grantStringify({ key: 'role', scope: 'global', task: task(1, 1, 1, 1) }),
    ],
  }),
];

const users: User[] = [
  entityCreate(userKey, {
    name: 'Base_eCrow',
    email: 'eric.crowell.base@ecrow.dev',
    password: passCreateSync('passwd1'),
    $roles: [roles[0].$id],
    $permits: [],
  }),
  entityCreate(userKey, {
    name: 'Mod_eCrow',
    email: 'eric.crowell.mod@ecrow.dev',
    password: passCreateSync('passwd2'),
    $roles: [roles[1].$id],
    $permits: [],
  }),
  entityCreate(userKey, {
    name: 'Admin_eCrow',
    email: 'eric.crowell.admin@ecrow.dev',
    password: passCreateSync('passwd3'),
    $roles: [roles[2].$id],
    $permits: [],
  }),
];

export function databaseSetup() {
  memory.create({
    [roleKey]: roles,
    [userKey]: users,
  });

  return memory;
}

export default databaseSetup;
