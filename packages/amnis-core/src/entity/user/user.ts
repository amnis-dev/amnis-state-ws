import type { LogCreator } from '../log/index.js';
import { regexAlphanumeric, regexEmail } from '../../regex.js';
import type { User, UserBase, UserCreator } from './user.types.js';
import { coreConfig } from '../../config.js';
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

  if (user.password && !regexAlphanumeric.test(user.name)) {
    logs.push({
      title: 'Invalid Username',
      description: 'The username must be alphanumeric.',
      level: 'error',
    });

    if (user.name.length > coreConfig.nameLength) {
      logs.push({
        title: 'Invalid Username',
        description: `The username cannot be longer than ${coreConfig.nameLength} characters.`,
        level: 'error',
      });
    }
  }

  if (!user.password && user.name.charAt(2) !== '#') {
    logs.push({
      title: 'Invalid Username',
      description: 'Username of passwordless accounts must have a hash character.',
      level: 'error',
    });
  }

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
