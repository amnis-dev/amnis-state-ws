import { nanoid } from '@reduxjs/toolkit';
import { grantCombineFromRoles } from '../../state/index.js';
import { uid } from '../../uid.js';
import type {
  Role, RoleBase, RoleCombo, RoleCreator, RoleFsLimits,
} from './role.types.js';

export const roleKey = 'role';

export const roleBase = (): RoleBase => ({
  name: 'Unconfigured Role',
  description: '',
  color: '',
  fsLimits: [0, 0, 0],
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
  const id = nanoid();
  const $roles = roles.map((r) => r.$id);
  const grants = grantCombineFromRoles(roles);
  const combo: RoleCombo = [id, $roles, grants];
  return combo;
}

export function roleFsLimitsCompress(
  fsLimitsArray: RoleFsLimits[],
): RoleFsLimits {
  const fsLimitsResult = fsLimitsArray.reduce<RoleFsLimits>(
    (acc, cur) => cur.map((limit, i) => {
      if (acc[i] < 0 || limit < 0) {
        return -1;
      }
      if (limit > acc[i]) {
        return limit;
      }
      return acc[i];
    }) as RoleFsLimits,
    [0, 0, 0],
  );

  return fsLimitsResult;
}
