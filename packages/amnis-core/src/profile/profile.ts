import { reference } from '../core.js';
import { entityCreate } from '../entity/entity.js';
import type { EntityExtension, EntityExtensionCreate } from '../entity/entity.types.js';
import type { LogBaseCreate } from '../log/index.js';
import type { Profile } from './profile.types.js';
import { userKey } from '../user/user.js';

export const profileKey = 'profile';

export const profileBase: EntityExtension<Profile> = {
  nameDisplay: 'Unnamed',
  $user: reference(userKey),
};

/**
 * Profile check method.
 */
export function profileCheck(profile: Profile): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function profileCreate(
  profile: EntityExtensionCreate<Profile, 'nameDisplay' | '$user'>,
): Profile {
  const profileEntity = entityCreate<Profile>(profileKey, {
    ...profileBase,
    ...profile,
  });

  return profileEntity;
}
