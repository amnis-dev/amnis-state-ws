import { uid } from '../uid.js';
import { entityCreate } from '../entity/entity.js';
import type { Entity } from '../entity/entity.types.js';
import type { Profile, ProfileBase, ProfileBaseCreate } from './profile.types.js';
import { userKey } from '../user/user.js';

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
