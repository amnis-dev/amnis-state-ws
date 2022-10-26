import {
  System,
  userKey,
  systemCreate,
  User,
  userCreate,
  profileKey,
  Profile,
  roleKey,
  Role,
  grantStringify,
  task,
  entityCreate,
  systemKey,
  websiteKey,
  StateCreate,
} from '@amnis/core';

export function dataInitial(): StateCreate {
  const roles: Role[] = [
    entityCreate<Role>('role', {
      name: 'Basic',
      description: 'Role with least amount of permissions needed for the typical user.',
      color: '#000000',
      grants: [
        grantStringify({ key: userKey, scope: 'owned', task: task(0, 1, 0, 0) }),
        grantStringify({ key: profileKey, scope: 'owned', task: task(0, 1, 1, 0) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(0, 1, 0, 0) }),
      ],
    }),
    entityCreate<Role>('role', {
      name: 'Administrator',
      description: 'Most permissive role for administration.',
      color: '#cc0000',
      grants: [
        grantStringify({ key: systemKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: websiteKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: userKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: roleKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(1, 1, 1, 1) }),
      ],
    }),
  ];

  const users: User[] = [
    userCreate({
      name: 'admin',
      email: 'example@email.address',
      /** passwd12 */
      password: '5cdfaa9ecce0125bd8a2bbe4243c099114e0620caa9795407c6e7a61a8b2fef439045d78c7a295c69651e037981e94d0',
      $roles: [roles[1].$id],
      $permits: [],
    }),
  ];

  const profiles: Profile[] = [
    entityCreate<Profile>('profile', {
      $user: users[0].$id,
      nameDisplay: 'Administrator',
    }, { $owner: users[0].$id }),
  ];

  const systems: System[] = [
    systemCreate({
      name: 'Main System',
      $adminRole: roles[1].$id,
      $initialRoles: [roles[0].$id],
    }),
  ];

  return {
    [roleKey]: roles,
    [userKey]: users,
    [profileKey]: profiles,
    [systemKey]: systems,
  };
}

export default dataInitial;
