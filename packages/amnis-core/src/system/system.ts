import { uid } from '../uid.js';
import { durationCalc } from '../core.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import { roleKey } from '../role/index.js';
import { websiteKey } from '../website/index.js';
import type { System } from './system.types.js';

export const systemKey = 'system';

export const systemBase: EntityExtension<System> = {
  name: '',
  sessionExpires: durationCalc('1h'),
  $website: uid(websiteKey),
  $adminRole: uid(roleKey),
  $initialRoles: [],
};

/**
 * System check method.
 */
export function systemCheck(system: System): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  if (system.name.length < 1) {
    logs.push({
      title: 'System Name Required',
      description: 'The system must have a name.',
      level: 'error',
    });
  }

  if (system.$initialRoles.length < 1) {
    logs.push({
      title: 'Missing Default Roles',
      description: 'New accounts will have same access as anonymous users.',
      level: 'warn',
    });
  }

  return logs;
}

export function systemCreate(
  system: EntityExtensionCreate<System, 'name' | '$adminRole'>,
): System {
  const systemEntity = entityCreate<System>(systemKey, {
    ...systemBase,
    ...system,
  });

  return systemEntity;
}
