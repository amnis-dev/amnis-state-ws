import {
  Challenge,
  challengeCreator,
  DateNumeric,
  dateNumeric,
  Entity,
  entityCreate,
  IoContext,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  contextSetup,
} from '@amnis/state';
import { challengeValidate } from './challenge.js';

let context: IoContext;
let challengeValid: Entity<Challenge>;
let challengeExpired: Entity<Challenge>;

beforeAll(async () => {
  context = await contextSetup({
    initialize: true,
  });
  challengeValid = entityCreate(challengeCreator({
    value: await context.crypto.randomString(16),
    expires: dateNumeric('15m'),
  }));
  challengeExpired = entityCreate(challengeCreator({
    value: await context.crypto.randomString(16),
    expires: dateNumeric() - 1000 as DateNumeric,
  }));
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
  expect(result.json.logs[0].title).toBe('Invalid Challenge Code');
});

test('should fail to find a non-existing challenge', async () => {
  const challengeNonExisting = challengeCreator({
    value: await context.crypto.randomString(16),
    expires: dateNumeric('15m'),
  });

  const result = challengeValidate(context, challengeNonExisting);

  if (result === true) {
    expect(result).not.toBe(true);
    return;
  }
  expect(result.status).toBe(500);
  expect(result.json.logs.length).toBeGreaterThan(0);
  expect(result.json.logs[0].title).toBe('Invalid Challenge Code');
});

test('should fail to find an existing challenge with a wrong value', async () => {
  const challengeNonExisting = challengeCreator({
    value: await context.crypto.randomString(16),
    expires: dateNumeric('15m'),
  });

  const challengeWrong = {
    ...challengeValid,
    value: challengeNonExisting.value,
  };

  const result = challengeValidate(context, challengeWrong);

  if (result === true) {
    expect(result).not.toBe(true);
    return;
  }
  expect(result.status).toBe(500);
  expect(result.json.logs.length).toBeGreaterThan(0);
  expect(result.json.logs[0].title).toBe('Invalid Challenge Code');
});
