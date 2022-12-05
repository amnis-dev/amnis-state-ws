import { uid } from '../../uid.js';
import { durationCalc } from '../../core.js';
import type { LogCreator } from '../log/index.js';
import { roleKey } from '../role/index.js';
import { websiteKey } from '../website/index.js';
import type { System, SystemBase, SystemCreator } from './system.types.js';

export const systemKey = 'system';

export const systemBase: SystemBase = {
  name: '',
  sessionExpires: durationCalc('1h'),
  registrationOpen: true,
  registrationExpiration: 30,
  $website: uid(websiteKey),
  $adminRole: uid(roleKey),
  $execRole: uid(roleKey),
  $initialRoles: [],
  $anonymousRoles: [],
};

/**
 * System check method.
 */
export function systemCheck(system: System): LogCreator[] {
  const logs: LogCreator[] = [];

  if (system.name.length < 1) {
    logs.push({
      title: 'System Name Required',
      description: 'The system must have a name.',
      level: 'error',
    });
  }

  return logs;
}

export function systemCreator(
  system: SystemCreator,
): System {
  return {
    ...systemBase,
    ...system,
    $id: uid(systemKey),
  };
}
