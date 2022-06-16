import { entityCreate } from '@amnis/core/index';
import { profileKey } from './profile';
import type { Profile } from './profile.types';

export const profileDefault: Profile = entityCreate<Profile>(profileKey, {
  myProperty: 'Unnamed',
});

export default profileDefault;
