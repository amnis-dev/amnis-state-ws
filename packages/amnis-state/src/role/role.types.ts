import type {
  Meta, Role, RoleCombo,
} from '@amnis/core';

/**
 * Role collection meta data.
 */
export interface RoleMeta extends Meta<Role> {
  /**
   * UUID to a tuple of role UIDs and a list of grants.
   */
  combo: Record<string, RoleCombo>;
}
