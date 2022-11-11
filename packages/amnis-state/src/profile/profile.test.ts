import { profileBase } from '@amnis/core';
import {
  profileInitialState,
  profileSelectors,
  profileActions,
} from './profile.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('profile should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().profile,
  ).toEqual(profileInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new profile', () => {
  const store = storeSetup();

  const action = profileActions.create({ ...profileBase });

  store.dispatch(action);
  const entities = profileSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    $user: expect.any(String),
    nameDisplay: expect.any(String),
  }));
});

/**
 * ============================================================
 */
test('should handle updating a profile', () => {
  const store = storeSetup();

  const actionCreate = profileActions.create({ ...profileBase });

  store.dispatch(actionCreate);
  const entities1 = profileSelectors.selectAll(store.getState());
  const profileId = entities1[0].$id;

  const actionUpdate = profileActions.update({
    $id: profileId,
    nameDisplay: 'New Profile Name',
  });

  store.dispatch(actionUpdate);
  const entities2 = profileSelectors.selectAll(store.getState());

  expect(entities2[0]).toEqual(expect.objectContaining({
    nameDisplay: 'New Profile Name',
  }));

  console.log(JSON.stringify(store.getState().profile.differences, null, 2));

  const original = store.getState().profile.original[profileId];
  const differences = store.getState().profile.differences[profileId];
  expect(original).toMatchObject(entities1[0]);
  expect(differences).toHaveLength(1);
  expect(differences).toEqual(expect.arrayContaining(['nameDisplay']));
});
