import { userKey } from '@amnis/core/user';
import { profileCreate } from '@amnis/core/profile';
import { reference } from '@amnis/core/core';

export const profileDefault = profileCreate({
  $user: reference(userKey, ''),
  nameDisplay: 'Unnamed',
});

export default profileDefault;
