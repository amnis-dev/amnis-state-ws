import { uid } from '../core';
import { profileKey } from '../profile';
import type { StateUpdate } from '../state';
import {
  historyKey, historyCreate, historyBase, historyMake,
} from './history';

/**
 * ============================================================
 */
test('history key should be is properly set', () => {
  expect(historyKey).toEqual('history');
});

/**
 * ============================================================
 */
test('should create a history', () => {
  const history = historyCreate(historyBase);

  expect(history).toEqual(
    expect.objectContaining(historyBase),
  );
});

/**
 * ============================================================
 */
test('should make history', () => {
  const profileId = uid('profile');
  const stateUpdate: StateUpdate = {
    profile: [{
      $id: profileId,
      nameDisplay: 'New Name',
    }],
  };

  const creatorId = uid('user');

  const stateCreateHistory = historyMake(stateUpdate, creatorId);

  expect(stateCreateHistory[historyKey][0]).toEqual(
    expect.objectContaining({
      $subject: profileId,
      update: stateUpdate.profile[0],
      $creator: creatorId,
    }),
  );
});

/**
 * ============================================================
 */
test('should not make history with denied key', () => {
  const profileId = uid('profile');
  const stateUpdate: StateUpdate = {
    profile: [{
      $id: profileId,
      nameDisplay: 'New Name',
    }],
  };

  const creatorId = uid('user');

  const stateCreateHistory = historyMake(stateUpdate, creatorId, [profileKey]);

  expect(stateCreateHistory[historyKey]).toHaveLength(0);
});
