import { grantStringify, task } from './grant/index.js';
import { Contact, contactCreator, contactKey } from './contact/index.js';
import { Profile, profileCreator, profileKey } from './profile/index.js';
import { Role, roleCreator, roleKey } from './role/index.js';
import { StateEntities } from './state/index.js';
import { System, systemCreator, systemKey } from './system/index.js';
import { User, userCreator, userKey } from './user/index.js';
import { websiteKey } from './website/index.js';
import { CryptoPassword } from './crypto.types.js';
import { auditKey, entityCreate, historyKey } from './index.js';

export function dataInitial(): StateEntities {
  /**
   * ================================================================================
   * Roles to be assigned to users
   */
  const roles: Role[] = [
    entityCreate(roleKey, roleCreator({
      name: 'Administrator',
      description: 'Most permissive role for overall system configuration and maintenance.',
      color: '#cc0000',
      grants: [
        grantStringify({ key: systemKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: websiteKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: auditKey, scope: 'global', task: task(0, 1, 1, 1) }),
        grantStringify({ key: historyKey, scope: 'global', task: task(0, 1, 1, 1) }),
        grantStringify({ key: userKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: roleKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: contactKey, scope: 'global', task: task(1, 1, 1, 1) }),
      ],
    }), { committed: true }),
    entityCreate(roleKey, roleCreator({
      name: 'Executive',
      description: 'Authoritative role for application configuration and maintenance.',
      color: '#3e3ee6',
      grants: [
        grantStringify({ key: websiteKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: auditKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: historyKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: userKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: roleKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(1, 1, 1, 1) }),
        grantStringify({ key: contactKey, scope: 'global', task: task(1, 1, 1, 1) }),
      ],
    }), { committed: true }),
    entityCreate(roleKey, roleCreator({
      name: 'Base',
      description: 'Basis for standard authenticated use of the application.',
      color: '#000000',
      grants: [
        grantStringify({ key: websiteKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: historyKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: userKey, scope: 'owned', task: task(0, 1, 0, 0) }),
        grantStringify({ key: profileKey, scope: 'owned', task: task(0, 1, 1, 0) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: contactKey, scope: 'owned', task: task(0, 1, 1, 0) }),
        grantStringify({ key: contactKey, scope: 'global', task: task(0, 1, 0, 0) }),
      ],
    }), { committed: true }),
    entityCreate(roleKey, roleCreator({
      name: 'Anonymous',
      description: 'Permissions for accessing the application without authentication.',
      color: '#000000',
      grants: [
        grantStringify({ key: websiteKey, scope: 'global', task: task(0, 1, 0, 0) }),
        grantStringify({ key: profileKey, scope: 'global', task: task(0, 1, 0, 0) }),
      ],
    }), { committed: true }),
  ];

  /**
   * ================================================================================
   * User Accounts
   */
  const users: User[] = [
    entityCreate(userKey, userCreator({
      name: 'admin',
      email: 'admin@email.address',
      /** passwd12 */
      password: 'rY2ezF3xDQdUZ6rIVk_R0nwrV1kTbN8Q7P9SY0TG0D0b6VzDCYwUgPPyTto0TVot' as CryptoPassword,
      $roles: [roles[0].$id],
      $permits: [],
    }), { committed: true }),
    entityCreate(userKey, userCreator({
      name: 'exec',
      email: 'exec@email.address',
      /** passwd12 */
      password: 'rY2ezF3xDQdUZ6rIVk_R0nwrV1kTbN8Q7P9SY0TG0D0b6VzDCYwUgPPyTto0TVot' as CryptoPassword,
      $roles: [roles[1].$id],
      $permits: [],
    }), { committed: true }),
    entityCreate(userKey, userCreator({
      name: 'user',
      email: 'user@email.address',
      /** passwd12 */
      password: 'rY2ezF3xDQdUZ6rIVk_R0nwrV1kTbN8Q7P9SY0TG0D0b6VzDCYwUgPPyTto0TVot' as CryptoPassword,
      $roles: [roles[2].$id],
      $permits: [],
    }), { committed: true }),
  ];

  /**
   * ================================================================================
   * User contacts.
   */
  const contacts: Contact[] = [
    entityCreate(contactKey, contactCreator({
      name: 'Administrator Contact',
      emails: [users[0].email as string],
    }), { $owner: users[0].$id, committed: true }),
    entityCreate(contactKey, contactCreator({
      name: 'Executive Contact',
      emails: [users[1].email as string],
    }), { $owner: users[1].$id, committed: true }),
    entityCreate(contactKey, contactCreator({
      name: 'User Contact',
      emails: [users[2].email as string],
    }), { $owner: users[2].$id, committed: true }),
  ];

  /**
   * ================================================================================
   * User profiles.
   */
  const profiles: Profile[] = [
    entityCreate(profileKey, profileCreator({
      $user: users[0].$id,
      $contact: contacts[0].$id,
      nameDisplay: 'Administrator',
    }), { $owner: users[0].$id, committed: true }),
    entityCreate(profileKey, profileCreator({
      $user: users[1].$id,
      $contact: contacts[1].$id,
      nameDisplay: 'Executive',
    }), { $owner: users[1].$id, committed: true }),
    entityCreate(profileKey, profileCreator({
      $user: users[2].$id,
      $contact: contacts[2].$id,
      nameDisplay: 'User',
    }), { $owner: users[2].$id, committed: true }),
  ];

  /**
   * ================================================================================
   * System settings.
   */
  const systems: System[] = [
    entityCreate(systemKey, systemCreator({
      name: 'Main System',
      $adminRole: roles[0].$id,
      $execRole: roles[1].$id,
      $initialRoles: [roles[2].$id],
      $anonymousRoles: [roles[3].$id],
    }), { committed: true }),
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
