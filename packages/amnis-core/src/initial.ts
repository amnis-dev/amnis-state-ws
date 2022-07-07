import { grantStringify, task } from './grant';
import { roleCreate } from './role';
import { StateCreate } from './state';
import { systemCreate } from './system';
import { websiteCreate } from './website';

export function coreInitialState(systemName = 'New System'): StateCreate {
  const roleBasic = roleCreate({
    name: 'Base',
    description: 'Most basic role assigned to all registered users.',
    grants: [
      grantStringify({ key: 'user', scope: 'owned', task: task(0, 1, 0, 0) }),
      grantStringify({ key: 'profile', scope: 'owned', task: task(0, 1, 1, 0) }),
      grantStringify({ key: 'profile', scope: 'global', task: task(0, 1, 0, 0) }),
    ],
  });

  const roleAdmin = roleCreate({
    name: 'Admin',
    description: 'Most basic role assigned to all registered users.',
    grants: [
      grantStringify({ key: 'system', scope: 'global', task: task(0, 1, 1, 0) }),
      grantStringify({ key: 'website', scope: 'global', task: task(0, 1, 1, 0) }),
      grantStringify({ key: 'role', scope: 'global', task: task(1, 1, 1, 1) }),
      grantStringify({ key: 'user', scope: 'global', task: task(0, 1, 0, 0) }),
      grantStringify({ key: 'profile', scope: 'global', task: task(0, 1, 1, 0) }),
    ],
  });

  const website = websiteCreate({
    name: 'New Website',
    url: 'http://localhost',
  });

  const system = systemCreate({
    name: systemName,
    $website: website.$id,
    $adminRole: roleAdmin.$id,
    $initialRoles: [roleBasic.$id],
  });

  /**
 * Initial recommended core state to be created.
 */
  const initialState: StateCreate = {
    role: [
      roleBasic,
      roleAdmin,
    ],
    website: [
      website,
    ],
    system: [
      system,
    ],
  };

  return initialState;
}

export default { coreInitialState };
