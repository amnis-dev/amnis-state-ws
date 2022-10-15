import { entityCreate } from '../entity/index.js';
import type { Role, RoleBase, RoleBaseCreate } from './role.types.js';

export const roleKey = 'role';

export const roleBase: RoleBase = {
  name: 'Unconfigured Role',
  description: '',
  color: '',
  grants: [],
};

export function roleCreate(
  role: RoleBaseCreate,
): Role {
  const roleEntity = entityCreate<Role>(roleKey, {
    ...roleBase,
    ...role,
  });

  return roleEntity;
}
