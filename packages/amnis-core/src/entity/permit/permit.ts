import { uid } from '../../uid.js';
import type {
  EntityExtension,
  EntityExtensionCreate,
  EntityCreator,
} from '../entity.types.js';
import type { Permit } from './permit.types.js';

export const permitKey = 'permit';

export const permitBase: EntityExtension<Permit> = {
  $issuer: uid('user'),
  $holder: uid('user'),
  $target: uid('entity'),
  grants: [],
};

export function permitCreator(
  permit: EntityExtensionCreate<Permit, '$issuer' | '$holder' | '$target'>,
): EntityCreator<Permit> {
  return {
    ...permitBase,
    ...permit,
    $id: uid(permitKey),
  };
}
