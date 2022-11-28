import { uid } from '../../uid.js';
import type { EntityCreator } from '../entity.types.js';
import type { Profile, ProfileBase, ProfileCreator } from './profile.types.js';
import { userKey } from '../user/user.js';

export const profileKey = 'profile';

export const profileBase: ProfileBase = {
  nameDisplay: 'Unnamed',
  $user: uid(userKey),
};

export function profileCreator(
  profile: ProfileCreator,
): EntityCreator<Profile> {
  return {
    ...profileBase,
    ...profile,
    $id: uid(profileKey),
  };
}
