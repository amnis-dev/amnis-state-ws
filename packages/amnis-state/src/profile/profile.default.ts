import { userKey, uid, profileCreate } from '@amnis/core';

export const profileDefault = profileCreate({
  $user: uid(userKey, ''),
  nameDisplay: 'Unnamed',
});

export default profileDefault;
