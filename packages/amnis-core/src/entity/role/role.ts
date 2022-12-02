import { uid } from '../../uid.js';
import type { Role, RoleBase, RoleCreator } from './role.types.js';

export const roleKey = 'role';

export const roleBase: RoleBase = {
  name: 'Unconfigured Role',
  description: '',
  color: '',
  grants: [],
};

export function roleCreator(
  role: RoleCreator,
): Role {
  return {
    ...roleBase,
    ...role,
    $id: uid(roleKey),
  };
}
