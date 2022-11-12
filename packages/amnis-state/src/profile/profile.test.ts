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

  const newName = 'New Profile Name';
  const actionUpdate = profileActions.update({
    $id: profileId,
    nameDisplay: newName,
  });

  store.dispatch(actionUpdate);
  const entities2 = profileSelectors.selectAll(store.getState());

  expect(entities2[0]).toEqual(expect.objectContaining({
    nameDisplay: newName,
  }));

  const diff = profileSelectors.selectDifference(store.getState(), profileId);

  expect(diff.original).toMatchObject(entities1[0]);
  expect(diff.keys).toHaveLength(1);
  expect(diff.keys).toEqual(expect.arrayContaining(['nameDisplay']));

  expect(Object.keys(diff.changes)).toHaveLength(1);
  expect(diff.changes?.nameDisplay).toEqual(newName);

  expect(Object.keys(diff.update)).toHaveLength(2);
  expect(diff.update.$id).toEqual(profileId);
  expect(diff.update?.nameDisplay).toEqual(newName);
});
