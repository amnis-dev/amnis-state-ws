import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Role,
  roleKey,
  metaInitial,
  coreSelectors,
  Entity,
  UID,
  State,
  RoleCombo,
  Grant,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { EntityState, PayloadAction } from '@reduxjs/toolkit';
import type { RoleMeta } from './role.types.js';

// /**
//  * Matcher for any update role action.
//  */
// function isRoleUpdate(
//   action: Action<string>,
// ): action is PayloadAction<EntityUpdater<Role>> {
//   return action.type === `${roleKey}/update`;
// }

// /**
//  * Matcher for any core action updates.
//  */
// function isRoleCoreUpdate(
//   action: Action<string>,
// ): action is PayloadAction<StateUpdater> {
//   return action.type === coreActions.update.type;
// }

/**
 * RTK role adapter.
 * Manages the normalized entities.
 */
export const roleAdapter = rtk.createEntityAdapter<Entity<Role>>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * Sort by the role's name.
   */
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized role state with meta information.
 */
export const roleInitialState = roleAdapter.getInitialState<RoleMeta>({
  ...metaInitial<Role>(),
  combo: {},
});

/**
 * RTK Role Slice
 */
export const roleSlice = rtk.createSlice({
  name: roleKey,
  initialState: roleInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Role>(roleKey, roleAdapter),

    /**
     * Combines a list of roles by ID
     */
    insertCombo: (state, action: PayloadAction<RoleCombo>) => {
      const combo = action.payload;
      const [comboId] = combo;

      state.combo[comboId] = combo;
    },
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(roleKey, roleAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(roleKey, roleAdapter, builder);
    // /**
    //  * Match a role update action.
    //  * This will update cached role combinations.
    //  */
    // builder.addMatcher(isRoleUpdate, (state, { payload }) => {
    //   Object.values(state.combo).forEach((combo) => {
    //     if (!combo[1].includes(payload.$id)) {
    //       return;
    //     }
    //     const [comboId, $comboRoles] = combo;

    //     const roles = $comboRoles
    //       .map(($role) => {
    //         const role = state.entities[$role];
    //         if (role && role.$id === payload.$id) {
    //           return {
    //             ...role,
    //             ...payload,
    //           };
    //         }
    //         return role;
    //       })
    //       .filter((role) => !!role) as Entity<Role>[];
    //     const $roles = roles.map((r) => r.$id);

    //     const grants = grantCombineFromRoles(roles);

    //     state.combo[comboId] = [comboId, $roles, grants];
    //   });
    // });
    // /**
    //  * Match a core update action.
    //  * This will update cached role combinations.
    //  */
    // builder.addMatcher(isRoleCoreUpdate, (state, { payload }) => {
    //   const roleUpdates = payload[roleKey];
    //   if (!roleUpdates) {
    //     return;
    //   }

    //   roleUpdates.forEach((updater) => {
    //     Object.values(state.combo).forEach((combo) => {
    //       if (!combo[1].includes(updater.$id)) {
    //         return;
    //       }
    //       const [comboId, $comboRoles] = combo;

    //       const roles = $comboRoles
    //         .map(($role) => {
    //           const role = state.entities[$role];
    //           if (role && role.$id === updater.$id) {
    //             return {
    //               ...role,
    //               ...updater,
    //             };
    //           }
    //           return role;
    //         })
    //         .filter((role) => !!role) as Entity<Role>[];

    //       const $roles = roles.map((r) => r.$id);

    //       const grants = grantCombineFromRoles(roles);

    //       state.combo[comboId] = [comboId, $roles, grants];
    //     });
    //   });
    // });
  },
});

/**
 * Role redux reducer.
 */
export const roleReducer = roleSlice.reducer;

/**
 * Role redux actions.
 */
export const roleActions = roleSlice.actions;

/**
 * Role redux selectors.
 */
export const roleSelectors = {
  /**
   * Gets entity selectors.
   */
  ...roleAdapter.getSelectors<{
    [roleKey]: typeof roleInitialState;
  }>((state) => state[roleKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Role>(roleKey),
  /**
   * Selects a combo id by role ids.
   */
  selectComboIdByRoles: (state: State, $roles: UID<Role>[]) => {
    const slice = state[roleKey] as RoleMeta & EntityState<Role>;
    const comboId = Object.keys(slice.combo).find(
      (k) => (
        slice.combo[k].length === $roles.length
          && slice.combo[k][1].every((val, i) => val === $roles[i])
      ),
    );
    return comboId;
  },
  /**
   * Selects a combo id by role ids.
   */
  selectComboGrants: (state: State, $combo: string): Grant[] | undefined => {
    const slice = state[roleKey] as RoleMeta & EntityState<Role>;
    const grants = slice.combo[$combo]?.[2];
    return grants;
  },
};

/**
 * Role redux selector keys.
 */
export type RoleSelector = Extract<keyof typeof roleSelectors, string>;

/**
 * Export the slice as default.
 */
export default roleSlice;
