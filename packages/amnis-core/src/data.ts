import {
  grantTask,
  StateEntities,
  GrantScope,
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
  Handle,
  handleCreator,
  handleKey,
} from './entity/index.js';
import { cryptoWeb } from './io/index.js';
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
        [systemKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [websiteKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [auditKey, GrantScope.Global, grantTask(0, 1, 1, 1)],
        [historyKey, GrantScope.Global, grantTask(0, 1, 1, 1)],
        [userKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [handleKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [credentialKey, GrantScope.Global, grantTask(0, 1, 0, 1)],
        [roleKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [profileKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [contactKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }), { committed: true, new: false }),
    entityCreate(roleCreator({
      name: 'Executive',
      description: 'Authoritative role for application configuration and maintenance.',
      color: '#3e3ee6',
      grants: [
        [websiteKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [auditKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [historyKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [userKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [handleKey, GrantScope.Global, grantTask(0, 0, 1, 1)],
        [credentialKey, GrantScope.Global, grantTask(0, 1, 0, 1)],
        [roleKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [profileKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
        [contactKey, GrantScope.Global, grantTask(1, 1, 1, 1)],
      ],
    }), { committed: true, new: false }),
    entityCreate(roleCreator({
      name: 'Base',
      description: 'Basis for standard authenticated use of the application.',
      color: '#000000',
      grants: [
        [websiteKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [historyKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [userKey, GrantScope.Owned, grantTask(0, 1, 1, 0)],
        [handleKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [credentialKey, GrantScope.Owned, grantTask(0, 1, 0, 1)],
        [profileKey, GrantScope.Owned, grantTask(0, 1, 1, 0)],
        [profileKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [contactKey, GrantScope.Owned, grantTask(0, 1, 1, 0)],
        [contactKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
      ],
    }), { committed: true, new: false }),
    entityCreate(roleCreator({
      name: 'Anonymous',
      description: 'Permissions for accessing the application data without authentication.',
      color: '#000000',
      grants: [
        [handleKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [profileKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
        [websiteKey, GrantScope.Global, grantTask(0, 1, 0, 0)],
      ],
    }), { committed: true, new: false }),
  ];

  /**
   * ================================================================================
   * User Accounts
   */

  // Setup the accounts.
  const accounts = await accountsGet();

  const users: Entity<User>[] = [
    entityCreate(userCreator({
      handle: accounts.admin.handle,
      password: await cryptoWeb.passHash(accounts.admin.password),
      email: 'admin@email.addr',
      emailVerified: true,
      $roles: [roles[0].$id],
      $permits: [],
    }), { committed: true, new: false }),
    entityCreate(userCreator({
      handle: accounts.exec.handle,
      password: await cryptoWeb.passHash(accounts.exec.password),
      email: 'exec@email.addr',
      emailVerified: true,
      $roles: [roles[1].$id],
      $permits: [],
    }), { committed: true, new: false }),
    entityCreate(userCreator({
      handle: accounts.user.handle,
      password: await cryptoWeb.passHash(accounts.user.password),
      email: 'user@email.addr',
      emailVerified: true,
      $roles: [roles[2].$id],
      $permits: [],
    }), { committed: true, new: false }),
  ];

  /**
   * User handles.
   */
  const handles: Entity<Handle>[] = [
    entityCreate(handleCreator({
      name: users[0].handle,
      $subject: users[0].$id,
    })),
    entityCreate(handleCreator({
      name: users[1].handle,
      $subject: users[1].$id,
    })),
    entityCreate(handleCreator({
      name: users[2].handle,
      $subject: users[2].$id,
    })),
  ];

  /**
   * ================================================================================
   * User credentials
   */
  const credentials: Entity<Credential>[] = [
    entityCreate(
      accounts.admin.credential,
      { $owner: users[0].$id, committed: true, new: false },
    ),
    entityCreate(
      accounts.exec.credential,
      { $owner: users[1].$id, committed: true, new: false },
    ),
    entityCreate(
      accounts.user.credential,
      { $owner: users[2].$id, committed: true, new: false },
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
    }), { $owner: users[0].$id, committed: true, new: false }),
    entityCreate(contactCreator({
      name: 'Executive Contact',
      emails: [users[1].email as string],
    }), { $owner: users[1].$id, committed: true, new: false }),
    entityCreate(contactCreator({
      name: 'User Contact',
      emails: [users[2].email as string],
    }), { $owner: users[2].$id, committed: true, new: false }),
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
    }), { $owner: users[0].$id, committed: true, new: false }),
    entityCreate(profileCreator({
      $user: users[1].$id,
      $contact: contacts[1].$id,
      nameDisplay: 'Executive',
    }), { $owner: users[1].$id, committed: true, new: false }),
    entityCreate(profileCreator({
      $user: users[2].$id,
      $contact: contacts[2].$id,
      nameDisplay: 'User',
    }), { $owner: users[2].$id, committed: true, new: false }),
  ];

  /**
   * ================================================================================
   * System settings.
   */
  const systems: Entity<System>[] = [
    entityCreate(systemCreator({
      name: 'Core System',
      $adminRole: roles[0].$id,
      $execRole: roles[1].$id,
      $anonymousRole: roles[3].$id,
      $initialRoles: [roles[2].$id],
    }), { committed: true, new: false }),
  ];

  return {
    [roleKey]: roles,
    [userKey]: users,
    [handleKey]: handles,
    [credentialKey]: credentials,
    [contactKey]: contacts,
    [profileKey]: profiles,
    [systemKey]: systems,
  };
};

export default dataInitial;
