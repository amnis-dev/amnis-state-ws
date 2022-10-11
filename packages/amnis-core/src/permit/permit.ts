import { uid } from '../uid';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Permit } from './permit.types';

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
