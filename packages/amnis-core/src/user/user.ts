import { deviceParse } from '../device';
import { entityCreate } from '../entity';
import { logCreate } from '../log';
import { regexAlphanumeric, regexEmail } from '../regex';
import { DeviceString } from '../types/device.types';
import type { EntityExtension, EntityExtensionCreate } from '../types/entity.types';
import { Log } from '../types/log.types';
import type { User } from '../types/user.types';

export const userKey = 'user';

export const userBase: EntityExtension<User> = {
  name: 'Unknown User',
  password: null,
  devices: [],
  $roles: [],
  $permits: [],
};

export function userValidateDevices(devices: DeviceString[]): boolean {
  return !!devices.find((device) => !deviceParse(device));
}

/**
 * User validation method.
 */
export function userValidate(user: User): Log[] {
  const logs: Log[] = [];

  if (user.password !== null && !regexAlphanumeric.test(user.name)) {
    logs.push(
      logCreate({
        title: 'Invalid Username',
        description: 'The username must be alphanumeric.',
        level: 'error',
      }),
    );
  }

  if (user.password === null && user.name.charAt(2) !== '#') {
    logs.push(
      logCreate({
        title: 'Invalid Username',
        description: 'Username of passwordless accounts must have a hash character.',
        level: 'error',
      }),
    );
  }

  if (user.email && !regexEmail.test(user.email)) {
    logs.push(
      logCreate({
        title: 'Invalid User Email',
        description: 'User email address is not structured properly.',
        level: 'error',
      }),
    );
  }

  if (user.devices?.length && userValidateDevices(user.devices)) {
    logs.push(
      logCreate({
        title: 'Invalid Device',
        description: 'The device associated with the user is invalid.',
        level: 'error',
      }),
    );
  }

  return logs;
}

/**
 * User creation.
 */
export function userCreate(
  user: EntityExtensionCreate<User, 'name'>,
): [User, Log[]] {
  const userEntity = entityCreate<User>(userKey, {
    ...userBase,
    ...user,
  });

  const logs = userValidate(userEntity);

  return [userEntity, logs];
}
