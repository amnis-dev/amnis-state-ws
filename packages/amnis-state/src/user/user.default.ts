import { entityCreate } from '@amnis/core/index';
import type { User } from './user.types';
import { userKey } from './user';

export const userDefault: User = entityCreate<User>(userKey, {
  name: 'Unnamed',
  email: 'unset@amnis.dev',
  password: null,
  $roles: [],
  $permits: [],
});

export default userDefault;
