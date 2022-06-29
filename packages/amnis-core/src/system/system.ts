import { durationCalc, reference } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { LogBaseCreate } from '../log';
import { websiteKey } from '../website';
import type { System } from './system.types';

export const systemKey = 'system';

export const systemBase: EntityExtension<System> = {
  name: '',
  sessionExpires: durationCalc('1h'),
  $website: reference(websiteKey),
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
  system: EntityExtensionCreate<System, 'name'>,
  checkSkip = false,
): [System, LogBaseCreate[]] {
  const systemEntity = entityCreate<System>(systemKey, {
    ...systemBase,
    ...system,
  });

  const logs: LogBaseCreate[] = [];
  if (!checkSkip) {
    logs.push(...systemCheck(systemEntity));
  }

  return [systemEntity, logs];
}
