import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { LogBaseCreate } from '../log';
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
export function roleCheck(role: Role): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function roleCreate(
  role: EntityExtensionCreate<Role, 'name'>,
): Role {
  const roleEntity = entityCreate<Role>(roleKey, {
    ...roleBase,
    ...role,
  });

  return roleEntity;
}
