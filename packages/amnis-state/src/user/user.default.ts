import { entityCreate, User } from '@amnis/core/index';
import { userKey } from './user';

export const userDefault: User = entityCreate<User>(userKey, {
  displayName: '',
  $licenses: [],
  $permits: [],
});

export default userDefault;
