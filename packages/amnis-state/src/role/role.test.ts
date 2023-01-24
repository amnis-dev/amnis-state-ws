import {
  entityCreate,
  GrantScope,
  roleBase,
  roleComboCreate,
  roleCreator,
  grantTask,
} from '@amnis/core';
import {
  roleInitialState,
  roleSelectors,
  roleActions,
} from './role.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('role should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().role,
  ).toEqual(roleInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new role', () => {
  const store = storeSetup();

  const action = roleActions.create(roleCreator(roleBase()));

  store.dispatch(action);
  const entities = roleSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    description: expect.any(String),
    color: expect.any(String),
    grants: expect.any(Array),
  }));
});

/**
 * ============================================================
 */
test('should create a new role combination and update it', () => {
  const store = storeSetup();

  const role1 = entityCreate(roleCreator({
    name: 'Role1',
    grants: [
      ['slice1', GrantScope.Global, grantTask(1, 0, 0, 0)],
      ['slice2', GrantScope.Global, grantTask(1, 0, 1, 1)],
      ['slice3', GrantScope.Global, grantTask(0, 1, 1, 0)],
    ],
  }));

  const role2 = entityCreate(roleCreator({
    name: 'Role2',
    grants: [
      ['slice1', GrantScope.Global, grantTask(1, 1, 1, 0)],
      ['slice2', GrantScope.Global, grantTask(0, 1, 0, 0)],
    ],
  }));

  const role3 = entityCreate(roleCreator({
    name: 'Role2',
    grants: [
      ['slice3', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ],
  }));

  /**
   * Test creating and inserting combos.
   */
  const grantsCreateExpected = [
    ['slice1', GrantScope.Global, grantTask(1, 1, 1, 0)],
    ['slice2', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['slice3', GrantScope.Global, grantTask(0, 1, 1, 0)],
  ];

  store.dispatch(roleActions.insertMany([role1, role2, role3]));

  const roleComboInsert = roleComboCreate([role1, role2]);

  store.dispatch(roleActions.insertCombo(roleComboInsert));
  const roleComboInsertResult = roleSelectors.selectComboGrants(
    store.getState(),
    roleComboInsert[0],
  );

  expect(roleComboInsertResult).toEqual(grantsCreateExpected);

  // /**
  //  * Testing updating a role grant list.
  //  */
  // const grantsUpdateExpected = [
  //   [ 'slice1', GrantScope.Global, grantTask(1, 0, 0, 0) ],
  //   [ 'slice2', GrantScope.Global, grantTask(1, 0, 1, 1) ],
  //   [ 'slice3', GrantScope.Global, grantTask(1, 1, 1, 1) ],
  // ];

  // store.dispatch(roleActions.update({
  //   $id: role2.$id,
  //   grants: [
  //     [ 'slice3', GrantScope.Global, grantTask(1, 1, 1, 1) ],
  //   ],
  // }));
  // const roleComboUpdateResult = roleSelectors.selectComboGrants(
  //   store.getState(),
  //   roleComboInsert[0],
  // );

  // expect(roleComboUpdateResult).toEqual(grantsUpdateExpected);

  // /**
  //  * Testing Core Update of a role grant list.
  //  */
  // const grantsCoreUpdateExpected = [
  //   [ 'slice1', GrantScope.Global, grantTask(1, 0, 0, 1) ],
  //   [ 'slice2', GrantScope.Global, grantTask(1, 0, 1, 1) ],
  //   [ 'slice3', GrantScope.Global, grantTask(0, 1, 1, 0) ],
  // ];

  // store.dispatch(coreActions.update({
  //   [roleKey]: [
  //     {
  //       $id: role2.$id,
  //       grants: [
  //         [ 'slice1', GrantScope.Global, grantTask(0, 0, 0, 1) ],
  //       ],
  //     },
  //   ],
  // }));

  // const roleComboCoreUpdateResult = roleSelectors.selectComboGrants(
  //   store.getState(),
  //   roleComboInsert[0],
  // );

  // expect(roleComboCoreUpdateResult).toEqual(grantsCoreUpdateExpected);
});
