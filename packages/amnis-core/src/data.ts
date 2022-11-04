import { grantStringify, task } from './grant/index.js';
import { Contact, contactCreate, contactKey } from './contact/index.js';
import { Profile, profileCreate, profileKey } from './profile/index.js';
import { Role, roleCreate, roleKey } from './role/index.js';
import { StateCreate } from './state/index.js';
import { System, systemCreate, systemKey } from './system/index.js';
import { User, userCreate, userKey } from './user/index.js';
import { websiteKey } from './website/index.js';

export function dataInitial(): StateCreate {
  /**
   * ================================================================================
   * Roles to be assigned to users
   */
  const roles: Role[] = [
    roleCreate({
      name: 'Administrator',
      description: 'Most permissive role for overall system configuration and maintenance.',
      color: '#cc0000',
      grants: [
        grantStringify({ key: systemKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: websiteKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: userKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: roleKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: contactKey, scope: 'global', task: task(1, 1, 1, 1) }),
      ],
    }),
    roleCreate({
      name: 'Executive',
      description: 'Authoritative role for application configuration and maintenance.',
      color: '#3e3ee6',
      grants: [
        grantStringify({ key: websiteKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: userKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: roleKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: contactKey, scope: 'global', task: task(1, 1, 1, 1) }),
      ],
    }),
    roleCreate({
      name: 'Base',
      description: 'Basis for standard authenticated use of the application.',
      color: '#000000',
      grants: [
        grantStringify({ key: websiteKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: userKey, scope: 'owned', task: task(0, 1, 0, 0) }),
        grantStringify({ key: profileKey, scope: 'owned', task: task(0, 1, 1, 0) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: contactKey, scope: 'owned', task: task(0, 1, 1, 0) }),
        grantStringify({ key: contactKey, scope: 'global', task: task(0, 1, 0, 0) }),
      ],
    }),
    roleCreate({
      name: 'Anonymous',
      description: 'Permissions for accessing the application without authentication.',
      color: '#000000',
      grants: [
        grantStringify({ key: websiteKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(0, 1, 0, 0) }),
      ],
    }),
  ];

  /**
   * ================================================================================
   * User Accounts
   */
  const users: User[] = [
    userCreate({
      name: 'admin',
      email: 'admin@email.address',
      /** passwd12 */
      password: '5cdfaa9ecce0125bd8a2bbe4243c099114e0620caa9795407c6e7a61a8b2fef439045d78c7a295c69651e037981e94d0',
      $roles: [roles[0].$id],
      $permits: [],
    }),
    userCreate({
      name: 'exec',
      email: 'exec@email.address',
      /** passwd12 */
      password: '5cdfaa9ecce0125bd8a2bbe4243c099114e0620caa9795407c6e7a61a8b2fef439045d78c7a295c69651e037981e94d0',
      $roles: [roles[1].$id],
      $permits: [],
    }),
    userCreate({
      name: 'user',
      email: 'user@email.address',
      /** passwd12 */
      password: '5cdfaa9ecce0125bd8a2bbe4243c099114e0620caa9795407c6e7a61a8b2fef439045d78c7a295c69651e037981e94d0',
      $roles: [roles[2].$id],
      $permits: [],
    }),
  ];

  /**
   * ================================================================================
   * User contacts.
   */
  const contacts: Contact[] = [
    contactCreate({
      name: 'Administrator Contact',
      emails: [users[0].email as string],
    }, { $owner: users[0].$id }),
    contactCreate({
      name: 'Executive Contact',
      emails: [users[1].email as string],
    }, { $owner: users[1].$id }),
    contactCreate({
      name: 'User Contact',
      emails: [users[2].email as string],
    }, { $owner: users[2].$id }),
  ];

  /**
   * ================================================================================
   * User profiles.
   */
  const profiles: Profile[] = [
    profileCreate({
      $user: users[0].$id,
      $contact: contacts[0].$id,
      nameDisplay: 'Administrator',
    }, { $owner: users[0].$id }),
    profileCreate({
      $user: users[1].$id,
      $contact: contacts[1].$id,
      nameDisplay: 'Executive',
    }, { $owner: users[1].$id }),
    profileCreate({
      $user: users[2].$id,
      $contact: contacts[2].$id,
      nameDisplay: 'User',
    }, { $owner: users[2].$id }),
  ];

  /**
   * ================================================================================
   * System settings.
   */
  const systems: System[] = [
    systemCreate({
      name: 'Main System',
      $adminRole: roles[0].$id,
      $execRole: roles[1].$id,
      $initialRoles: [roles[2].$id],
      $anonymousRoles: [roles[3].$id],
    }),
  ];

  return {
    [roleKey]: roles,
    [userKey]: users,
    [contactKey]: contacts,
    [profileKey]: profiles,
    [systemKey]: systems,
  };
}

export default dataInitial;
