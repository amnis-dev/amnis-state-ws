import { reference } from './core';
import { entityCreate } from './entity';
import type { EntityExtension, EntityExtensionCreate } from './types/entity.types';
import { Log } from './types/log.types';
import type { Profile } from './types/profile.types';
import { userKey } from './user';

export const profileKey = 'profile';

export const profileBase: EntityExtension<Profile> = {
  nameDisplay: 'Unnamed',
  $user: reference(userKey),
};

export function profileCreate(
  profile: EntityExtensionCreate<Profile, 'nameDisplay' | '$user'>,
): [Profile, Log[]] {
  const logs: Log[] = [];

  return [
    entityCreate<Profile>(profileKey, {
      ...profileBase,
      ...profile,
    }),
    logs,
  ];
}
