import { reference } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
import type { Permit } from './permit.types';

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
export function permitCheck(permit: Permit): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function permitCreate(
  permit: EntityExtensionCreate<Permit, '$issuer' | '$holder' | '$target'>,
  checkSkip = false,
): [Permit, Log[]] {
  const permitEntity = entityCreate<Permit>(permitKey, {
    ...permitBase,
    ...permit,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...permitCheck(permitEntity));
  }

  return [permitEntity, logs];
}
