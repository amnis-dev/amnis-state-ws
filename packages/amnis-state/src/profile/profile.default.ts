import { userKey } from '@amnis/core/user';
import { profileCreate } from '@amnis/core/profile';
import { identifier } from '@amnis/core/core';

export const profileDefault = profileCreate({
  $user: identifier(userKey, ''),
  nameDisplay: 'Unnamed',
});

export default profileDefault;
