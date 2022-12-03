import type { LogCreator } from '../log/index.js';
import { regexEmail } from '../../regex.js';
import type { User, UserBase, UserCreator } from './user.types.js';
import { uid } from '../../uid.js';

export const userKey = 'user';

export const userBase: UserBase = {
  name: 'Unknown User',
  $credentials: [],
  $roles: [],
  $permits: [],
};

/**
 * User validation method.
 */
export function userCheck(user: User): LogCreator[] {
  const logs: LogCreator[] = [];

  if (user.email && !regexEmail.test(user.email)) {
    logs.push({
      title: 'Invalid User Email',
      description: 'User email address is not structured properly.',
      level: 'error',
    });
  }

  return logs;
}

/**
 * User creation.
 */
export function userCreator(
  user: UserCreator,
): User {
  return {
    ...userBase,
    ...user,
    $id: uid(userKey),
  };
}
