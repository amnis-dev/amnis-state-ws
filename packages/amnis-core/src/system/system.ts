import { reference } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
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
export function systemCheck(system: System): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function systemCreate(
  system: EntityExtensionCreate<System, 'name'>,
  checkSkip = false,
): [System, Log[]] {
  const systemEntity = entityCreate<System>(systemKey, {
    ...systemBase,
    ...system,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...systemCheck(systemEntity));
  }

  return [systemEntity, logs];
}
