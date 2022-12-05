import {
  grantStringify,
  task,
  StateEntities,
} from './state/index.js';
import {
  Contact,
  contactCreator,
  contactKey,
  Profile,
  profileCreator,
  profileKey,
  Role,
  roleCreator,
  roleKey,
  System,
  systemCreator,
  systemKey,
  User,
  userCreator,
  userKey,
  websiteKey,
  auditKey,
  entityCreate,
  historyKey,
  Entity,
  Credential,
  credentialKey,
} from './entity/index.js';

import { accountsGet } from './accounts.js';

export const dataInitial = async (): Promise<StateEntities> => {
  /**
   * ================================================================================
   * Roles to be assigned to users
   */
  const roles: Entity<Role>[] = [
    entityCreate(roleCreator({
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
    entityCreate(roleCreator({
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
    entityCreate(roleCreator({
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
    entityCreate(roleCreator({
      name: 'Anonymous',
      description: 'Permissions for accessing the application without authentication.',
      color: '#000000',
      grants: [
        grantStringify({ key: websiteKey, scope: 'global', task: task(0, 1, 0, 0) }),
      ],
    }), { committed: true }),
  ];

  /**
   * ================================================================================
   * User Accounts
   */

  // Setup the accounts.
  const accounts = await accountsGet();

  const users: Entity<User>[] = [
    entityCreate(userCreator({
      name: accounts.admin.name,
      email: 'admin@email.address',
      $roles: [roles[0].$id],
      $permits: [],
    }), { committed: true }),
    entityCreate(userCreator({
      name: accounts.exec.name,
      email: 'exec@email.address',
      $roles: [roles[1].$id],
      $permits: [],
    }), { committed: true }),
    entityCreate(userCreator({
      name: accounts.user.name,
      email: 'user@email.address',
      $roles: [roles[2].$id],
      $permits: [],
    }), { committed: true }),
  ];

  /**
   * ================================================================================
   * User credentials
   */
  const credentials: Entity<Credential>[] = [
    entityCreate(
      accounts.admin.credential,
      { $owner: users[0].$id, committed: true },
    ),
    entityCreate(
      accounts.exec.credential,
      { $owner: users[1].$id, committed: true },
    ),
    entityCreate(
      accounts.user.credential,
      { $owner: users[2].$id, committed: true },
    ),
  ];

  users[0].$credentials.push(credentials[0].$id);
  users[1].$credentials.push(credentials[1].$id);
  users[2].$credentials.push(credentials[2].$id);

  /**
   * ================================================================================
   * User contacts.
   */
  const contacts: Entity<Contact>[] = [
    entityCreate(contactCreator({
      name: 'Administrator Contact',
      emails: [users[0].email as string],
    }), { $owner: users[0].$id, committed: true }),
    entityCreate(contactCreator({
      name: 'Executive Contact',
      emails: [users[1].email as string],
    }), { $owner: users[1].$id, committed: true }),
    entityCreate(contactCreator({
      name: 'User Contact',
      emails: [users[2].email as string],
    }), { $owner: users[2].$id, committed: true }),
  ];

  /**
   * ================================================================================
   * User profiles.
   */
  const profiles: Entity<Profile>[] = [
    entityCreate(profileCreator({
      $user: users[0].$id,
      $contact: contacts[0].$id,
      nameDisplay: 'Administrator',
    }), { $owner: users[0].$id, committed: true }),
    entityCreate(profileCreator({
      $user: users[1].$id,
      $contact: contacts[1].$id,
      nameDisplay: 'Executive',
    }), { $owner: users[1].$id, committed: true }),
    entityCreate(profileCreator({
      $user: users[2].$id,
      $contact: contacts[2].$id,
      nameDisplay: 'User',
    }), { $owner: users[2].$id, committed: true }),
  ];

  /**
   * ================================================================================
   * System settings.
   */
  const systems: Entity<System>[] = [
    entityCreate(systemCreator({
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
    [credentialKey]: credentials,
    [contactKey]: contacts,
    [profileKey]: profiles,
    [systemKey]: systems,
  };
};

export default dataInitial;
