import { Entity, entityCreate } from '../entity/index.js';
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
  entity: Partial<Entity> = {},
): Role {
  const roleEntity = entityCreate<Role>(roleKey, {
    ...roleBase,
    ...role,
  }, entity);

  return roleEntity;
}
