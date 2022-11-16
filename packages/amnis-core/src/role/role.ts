import type { EntityCreator } from '../entity/index.js';
import { uid } from '../uid.js';
import type { Role, RoleBase, RoleBaseCreate } from './role.types.js';

export const roleKey = 'role';

export const roleBase: RoleBase = {
  name: 'Unconfigured Role',
  description: '',
  color: '',
  grants: [],
};

export function roleCreator(
  role: RoleBaseCreate,
): EntityCreator<Role> {
  return {
    ...roleBase,
    ...role,
    $id: uid(roleKey),
  };
}
