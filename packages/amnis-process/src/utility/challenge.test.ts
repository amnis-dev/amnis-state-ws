import {
  Challenge,
  challengeCreate,
  DateNumeric,
  dateNumeric,
  IoContext,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  contextSetup,
} from '@amnis/state';
import { challengeValidate } from './challenge.js';

let context: IoContext;
let challengeValid: Challenge;
let challengeExpired: Challenge;

beforeAll(async () => {
  context = await contextSetup({
    initialize: true,
  });
  challengeValid = challengeCreate({
    val: await context.crypto.randomString(16),
    exp: dateNumeric('15m'),
  });
  challengeExpired = challengeCreate({
    val: await context.crypto.randomString(16),
    exp: dateNumeric() - 1000 as DateNumeric,
  });
  context.store.dispatch(challengeActions.insert(challengeValid));
  context.store.dispatch(challengeActions.insert(challengeExpired));
});

test('should successfully validate a valid challenge', async () => {
  const result = challengeValidate(context, challengeValid);

  expect(result).toBe(true);

  /**
   * Should no longer find the challenge entity in the context store.
   */
  const challenge = challengeSelectors.selectById(
    context.store.getState(),
    challengeValid.$id,
  );

  expect(challenge).toBeUndefined();
});

test('should fail to validate an expired challenge', async () => {
  const result = challengeValidate(context, challengeExpired);

  if (result === true) {
    expect(result).not.toBe(true);
    return;
  }
  expect(result.status).toBe(500);
  expect(result.json.logs.length).toBeGreaterThan(0);
  expect(result.json.logs[0].title).toBe('Invalid Challenge');
});

test('should fail to find a non-existing challenge', async () => {
  const challengeNonExisting = challengeCreate({
    val: await context.crypto.randomString(16),
    exp: dateNumeric('15m'),
  });

  const result = challengeValidate(context, challengeNonExisting);

  if (result === true) {
    expect(result).not.toBe(true);
    return;
  }
  expect(result.status).toBe(500);
  expect(result.json.logs.length).toBeGreaterThan(0);
  expect(result.json.logs[0].title).toBe('Invalid Challenge');
});

test('should fail to find an existing challenge with a wrong value', async () => {
  const challengeNonExisting = challengeCreate({
    val: await context.crypto.randomString(16),
    exp: dateNumeric('15m'),
  });

  const challengeWrong = {
    ...challengeValid,
    val: challengeNonExisting.val,
  };

  const result = challengeValidate(context, challengeWrong);

  if (result === true) {
    expect(result).not.toBe(true);
    return;
  }
  expect(result.status).toBe(500);
  expect(result.json.logs.length).toBeGreaterThan(0);
  expect(result.json.logs[0].title).toBe('Invalid Challenge');
});
