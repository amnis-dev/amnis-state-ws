import { reference } from '../core';
import { entityCreate } from '../entity/entity';
import type { EntityExtension, EntityExtensionCreate } from '../entity/entity.types';
import type { Log } from '../log';
import type { Profile } from './profile.types';
import { userKey } from '../user/user';

export const profileKey = 'profile';

export const profileBase: EntityExtension<Profile> = {
  nameDisplay: 'Unnamed',
  $user: reference(userKey),
};

/**
 * Profile check method.
 */
export function profileCheck(profile: Profile): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function profileCreate(
  profile: EntityExtensionCreate<Profile, 'nameDisplay' | '$user'>,
  checkSkip = false,
): [Profile, Log[]] {
  const profileEntity = entityCreate<Profile>(profileKey, {
    ...profileBase,
    ...profile,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...profileCheck(profileEntity));
  }

  return [profileEntity, logs];
}
