import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
import type { Role } from './role.types';

export const roleKey = 'role';

export const roleBase: EntityExtension<Role> = {
  name: 'Unconfigured Role',
  description: '',
  color: '',
  grants: [],
};

/**
 * Role check method.
 */
export function roleCheck(role: Role): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function roleCreate(
  role: EntityExtensionCreate<Role, 'name'>,
  checkSkip = false,
): [Role, Log[]] {
  const roleEntity = entityCreate<Role>(roleKey, {
    ...roleBase,
    ...role,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...roleCheck(roleEntity));
  }

  return [roleEntity, logs];
}
