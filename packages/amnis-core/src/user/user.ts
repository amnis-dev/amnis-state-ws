import { deviceParse } from '../device';
import { entityCreate } from '../entity';
import { LogBaseCreate } from '../log';
import { regexAlphanumeric, regexEmail } from '../regex';
import type { DeviceString } from '../device';
import type { EntityExtension, EntityExtensionCreate } from '../entity/entity.types';
import type { User } from './user.types';
import { coreConfig } from '../config';

export const userKey = 'user';

export const userBase: EntityExtension<User> = {
  name: 'Unknown User',
  password: null,
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
export function userCheck(user: User): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  if (user.password !== null && !regexAlphanumeric.test(user.name)) {
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

  if (user.password === null && user.name.charAt(2) !== '#') {
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
export function userCreate(
  user: EntityExtensionCreate<User, 'name'>,
): User {
  const userEntity = entityCreate<User>(userKey, {
    ...userBase,
    ...user,
  });

  return userEntity;
}
