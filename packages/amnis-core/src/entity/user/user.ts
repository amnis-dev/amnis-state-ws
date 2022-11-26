import { deviceParse } from '../device/index.js';
import type { EntityCreator } from '../entity.types.js';
import type { LogBaseCreate } from '../log/index.js';
import { regexAlphanumeric, regexEmail } from '../../regex.js';
import type { DeviceString } from '../device/index.js';
import type { User, UserBase, UserBaseCreate } from './user.types.js';
import { coreConfig } from '../../config.js';
import { uid } from '../../uid.js';

export const userKey = 'user';

export const userBase: UserBase = {
  name: 'Unknown User',
  devices: [],
  $roles: [],
  $permits: [],
};

export function userCheckDevices(devices: DeviceString[]): boolean {
  return !!devices.find((device) => !deviceParse(device));
}

/**
 * User validation method.
 */
export function userCheck(user: EntityCreator<User>): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

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

  if (user.devices?.length && userCheckDevices(user.devices)) {
    logs.push({
      title: 'Invalid Device',
      description: 'The device associated with the user is invalid.',
      level: 'error',
    });
  }

  return logs;
}

/**
 * User creation.
 */
export function userCreator(
  user: UserBaseCreate,
): EntityCreator<User> {
  return {
    ...userBase,
    ...user,
    $id: uid(userKey),
  };
}
