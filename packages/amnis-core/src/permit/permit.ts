import { identifier } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { LogBaseCreate } from '../log';
import type { Permit } from './permit.types';

export const permitKey = 'permit';

export const permitBase: EntityExtension<Permit> = {
  $issuer: identifier('user'),
  $holder: identifier('user'),
  $target: identifier('entity'),
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
