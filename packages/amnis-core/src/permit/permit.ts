import { reference } from '../core.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import type { Permit } from './permit.types.js';

export const permitKey = 'permit';

export const permitBase: EntityExtension<Permit> = {
  $issuer: reference('user'),
  $holder: reference('user'),
  $target: reference('entity'),
  grants: [],
};

/**
 * Permit check method.
 */
export function permitCheck(permit: Permit): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function permitCreate(
  permit: EntityExtensionCreate<Permit, '$issuer' | '$holder' | '$target'>,
): Permit {
  const permitEntity = entityCreate<Permit>(permitKey, {
    ...permitBase,
    ...permit,
  });

  return permitEntity;
}
