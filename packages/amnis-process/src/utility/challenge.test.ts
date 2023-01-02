import {
  Challenge,
  challengeCreate,
  DateNumeric,
  dateNumeric,
  IoContext,
  uid,
  userKey,
} from '@amnis/core';
import {
  challengeActions,
  challengeSelectors,
  contextSetup,
} from '@amnis/state';
import { challengeValidate } from './challenge.js';

const challengeSubjectId = uid(userKey);

let context: IoContext;
let challengeValid: Challenge;
let challengeExpired: Challenge;
let challengeSubject: Challenge;

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
  challengeSubject = challengeCreate({
    val: await context.crypto.randomString(16),
    exp: dateNumeric('15m'),
    $sub: challengeSubjectId,
  });
  context.store.dispatch(challengeActions.insert(challengeValid));
  context.store.dispatch(challengeActions.insert(challengeExpired));
  context.store.dispatch(challengeActions.insert(challengeSubject));
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

test('should fail to validate a valid user challenge without a subject', async () => {
  const result = challengeValidate(context, { ...challengeSubject, $sub: undefined });

  if (result === true) {
    expect(result).not.toBe(true);
    return;
  }
  expect(result.status).toBe(500);
  expect(result.json.logs.length).toBeGreaterThan(0);
  expect(result.json.logs[0].title).toBe('Not Challenged');
});

test('should fail to validate a valid user challenge with an invalid subject', async () => {
  const result = challengeValidate(context, { ...challengeSubject, $sub: uid(userKey) });

  if (result === true) {
    expect(result).not.toBe(true);
    return;
  }
  expect(result.status).toBe(500);
  expect(result.json.logs.length).toBeGreaterThan(0);
  expect(result.json.logs[0].title).toBe('Not Challenged');
});

test('should validate a valid user challenge with the correct subject', async () => {
  const result = challengeValidate(context, { ...challengeSubject, $sub: challengeSubjectId });

  expect(result).toBe(true);
});
