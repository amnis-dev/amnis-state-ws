import { Profile, entityCreate, reference } from '@amnis/core/index';
import { userKey } from '../user';
import { profileKey } from './profile';

export const profileDefault: Profile = entityCreate<Profile>(profileKey, {
  $user: reference(userKey, ''),
  nameDisplay: 'Unnamed',
});

export default profileDefault;
