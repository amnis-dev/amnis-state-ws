import { uid } from '../uid.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { Permit } from './permit.types.js';

export const permitKey = 'permit';

export const permitBase: EntityExtension<Permit> = {
  $issuer: uid('user'),
  $holder: uid('user'),
  $target: uid('entity'),
  grants: [],
};

export function permitCreate(
  permit: EntityExtensionCreate<Permit, '$issuer' | '$holder' | '$target'>,
): Permit {
  const permitEntity = entityCreate<Permit>(permitKey, {
    ...permitBase,
    ...permit,
  });

  return permitEntity;
}
