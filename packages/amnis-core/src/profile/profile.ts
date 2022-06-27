import { reference } from '../core';
import { entityCreate } from '../entity/entity';
import type { EntityExtension, EntityExtensionCreate } from '../entity/entity.types';
import type { LogBaseCreate } from '../log';
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
export function profileCheck(profile: Profile): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function profileCreate(
  profile: EntityExtensionCreate<Profile, 'nameDisplay' | '$user'>,
  checkSkip = false,
): [Profile, LogBaseCreate[]] {
  const profileEntity = entityCreate<Profile>(profileKey, {
    ...profileBase,
    ...profile,
  });

  const logs: LogBaseCreate[] = [];
  if (!checkSkip) {
    logs.push(...profileCheck(profileEntity));
  }

  return [profileEntity, logs];
}
