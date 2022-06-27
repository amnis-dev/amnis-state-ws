import { reference } from '../core';
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
  sessionExpires: 36000,
  $website: reference(websiteKey),
  $initialRoles: [],
};

/**
 * System check method.
 */
export function systemCheck(system: System): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

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
