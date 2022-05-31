import { entityCreate, User } from '@amnis/core/index';
import { userKey } from './user';

export const userDefault: User = entityCreate<User>(userKey, {
  name: 'eCrow',
  email: 'eric.crowell@ecrow.dev',
  $roles: [],
  $permits: [],
});

export default userDefault;
