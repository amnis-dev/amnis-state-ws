import { uid } from '../../uid.js';
import type {
  EntityCreatorBase, EntityCreatorParams,
} from '../entity.types.js';
import type { Permit } from './permit.types.js';

export const permitKey = 'permit';

export const permitBase: EntityCreatorBase<Permit> = {
  $issuer: uid('user'),
  $holder: uid('user'),
  $target: uid('entity'),
  grants: [],
};

export function permitCreator(
  permit: EntityCreatorParams<Permit, '$issuer' | '$holder' | '$target'>,
): Permit {
  return {
    ...permitBase,
    ...permit,
    $id: uid(permitKey),
  };
}
