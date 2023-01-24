import { rtk } from '../../rtk.js';
import { grantCombineFromRoles } from '../../state/index.js';
import { uid } from '../../uid.js';
import type {
  Role, RoleBase, RoleCombo, RoleCreator,
} from './role.types.js';

export const roleKey = 'role';

export const roleBase = (): RoleBase => ({
  name: 'Unconfigured Role',
  description: '',
  color: '',
  grants: [],
});

export function roleCreator(
  role: RoleCreator,
): Role {
  return {
    ...roleBase(),
    ...role,
    $id: uid(roleKey),
  };
}

export function roleComboCreate(
  roles: Role[],
): RoleCombo {
  const id = rtk.nanoid();
  const $roles = roles.map((r) => r.$id);
  const grants = grantCombineFromRoles(roles);
  const combo: RoleCombo = [id, $roles, grants];
  return combo;
}
