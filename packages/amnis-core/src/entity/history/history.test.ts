import { uid } from '../../uid.js';
import { GrantTask, StateDeleter, StateUpdater } from '../../state/index.js';
import {
  historyKey, historyCreator, historyBase, historyMake,
} from './history.js';

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
  const history = historyCreator(historyBase());

  expect(history).toMatchObject({
    $subject: expect.any(String),
    task: GrantTask.None,
    mutation: {},
  });
});

/**
 * ============================================================
 */
test('should make history from state updater', () => {
  const profileId1 = uid('profile');
  const profileId2 = uid('profile');
  const stateUpdate: StateUpdater = {
    profile: [{
      $id: profileId1,
      nameDisplay: 'Profile 1',
    },
    {
      $id: profileId2,
      nameDisplay: 'Profile 2',
    },
    ],
  };

  const histories = historyMake(stateUpdate, GrantTask.Update);

  expect(histories).toHaveLength(2);
  expect(histories[0]).toEqual({
    $id: expect.any(String),
    $subject: profileId1,
    task: GrantTask.Update,
    mutation: {
      $id: profileId1,
      nameDisplay: stateUpdate.profile[0].nameDisplay,
    },
  });
  expect(histories[1]).toEqual({
    $id: expect.any(String),
    $subject: profileId2,
    task: GrantTask.Update,
    mutation: {
      $id: profileId2,
      nameDisplay: stateUpdate.profile[1].nameDisplay,
    },
  });
});

/**
 * ============================================================
 */
test('should make history from state deleter', () => {
  const profileId1 = uid('profile');
  const profileId2 = uid('profile');
  const stateDeleter: StateDeleter = {
    profile: [profileId1, profileId2],
  };

  const histories = historyMake(stateDeleter, GrantTask.Delete);

  expect(histories).toHaveLength(2);
  expect(histories[0]).toEqual({
    $id: expect.any(String),
    $subject: profileId1,
    task: GrantTask.Delete,
    mutation: profileId1,
  });
  expect(histories[1]).toEqual({
    $id: expect.any(String),
    $subject: profileId2,
    task: GrantTask.Delete,
    mutation: profileId2,
  });
});
