import { entityCreate, grantStringify, task } from '@amnis/core/core';
import { Role } from '@amnis/core/types';
import { memory } from '@amnis/db/memory';
import { roleKey } from '@amnis/state/role';

const roles: Role[] = [
  entityCreate<Role>(roleKey, {
    name: 'Base',
    description: 'Most basic role assigned to all registered users.',
    color: '#000000',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(0, 1, 0, 0) }),
      grantStringify({ key: 'user', scope: 'owned', task: task(0, 1, 1, 0) }),
    ],
  }),
  entityCreate<Role>(roleKey, {
    name: 'Moderator',
    description: 'Most basic role assigned to all registered users.',
    color: '#000000',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(0, 1, 1, 0) }),
    ],
  }),
  entityCreate<Role>(roleKey, {
    name: 'Administrator',
    description: 'Most basic role assigned to all registered users.',
    color: '#000000',
    grants: [
      grantStringify({ key: 'user', scope: 'global', task: task(1, 1, 1, 1) }),
    ],
  }),
];

export function databaseSetup() {
  memory.create({
    [roleKey]: roles,
  });

  return memory;
}

export default databaseSetup;
