import { uid } from '../uid.js';
import { durationCalc } from '../core.js';
import { entityCreate, Entity } from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import { roleKey } from '../role/index.js';
import { websiteKey } from '../website/index.js';
import type { System, SystemBase, SystemBaseCreate } from './system.types.js';

export const systemKey = 'system';

export const systemBase: SystemBase = {
  name: '',
  sessionExpires: durationCalc('1h'),
  $website: uid(websiteKey),
  $adminRole: uid(roleKey),
  $execRole: uid(roleKey),
  $initialRoles: [],
  $anonymousRoles: [],
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

  return logs;
}

export function systemCreate(
  system: SystemBaseCreate,
  entity: Partial<Entity> = {},
): System {
  const systemEntity = entityCreate<System>(systemKey, {
    ...systemBase,
    ...system,
  }, entity);

  return systemEntity;
}
