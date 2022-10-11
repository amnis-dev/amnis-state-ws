import { userKey } from '@amnis/core/user';
import { profileCreate } from '@amnis/core/profile';
import { uid } from '@amnis/core/uid';

export const profileDefault = profileCreate({
  $user: uid(userKey, ''),
  nameDisplay: 'Unnamed',
});

export default profileDefault;
