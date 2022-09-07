import { reference } from '../core';
import { entityCreate } from '../entity/entity';
import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity/entity.types';
import type { Profile } from './profile.types';
import { userKey } from '../user/user';

export const profileKey = 'profile';

export const profileBase: EntityExtension<Profile> = {
  nameDisplay: 'Unnamed',
  $user: reference(userKey),
};

export function profileCreate(
  profile: EntityExtensionCreate<Profile, 'nameDisplay' | '$user'>,
  entity: Partial<Entity> = {},
): Profile {
  const profileEntity = entityCreate<Profile>(profileKey, {
    ...profileBase,
    ...profile,
  }, entity);

  return profileEntity;
}
