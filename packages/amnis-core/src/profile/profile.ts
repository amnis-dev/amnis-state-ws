import { uid } from '../core';
import { entityCreate } from '../entity/entity';
import type { Entity } from '../entity/entity.types';
import type { Profile, ProfileBase, ProfileBaseCreate } from './profile.types';
import { userKey } from '../user/user';

export const profileKey = 'profile';

export const profileBase: ProfileBase = {
  nameDisplay: 'Unnamed',
  $user: uid(userKey),
};

export function profileCreate(
  profile: ProfileBaseCreate,
  entity: Partial<Entity> = {},
): Profile {
  const profileEntity = entityCreate<Profile>(profileKey, {
    ...profileBase,
    ...profile,
  }, entity);

  return profileEntity;
}
