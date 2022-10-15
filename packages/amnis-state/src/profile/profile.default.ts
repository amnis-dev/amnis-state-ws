import { userKey } from '@amnis/core/user/index.js';
import { profileCreate } from '@amnis/core/profile/index.js';
import { uid } from '@amnis/core/uid.js';

export const profileDefault = profileCreate({
  $user: uid(userKey, ''),
  nameDisplay: 'Unnamed',
});

export default profileDefault;
