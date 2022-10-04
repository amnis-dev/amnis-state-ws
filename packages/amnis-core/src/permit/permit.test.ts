import { identifier } from '../core';
import { permitKey, permitCreate } from './permit';

/**
 * ============================================================
 */
test('permit key should be is properly set', () => {
  expect(permitKey).toEqual('permit');
});

/**
 * ============================================================
 */
test('should create a permit', () => {
  const permit = permitCreate({
    $issuer: identifier('user'),
    $holder: identifier('user'),
    $target: identifier('entity'),
  });

  expect(permit).toEqual(
    expect.objectContaining({
      $issuer: expect.any(String),
      $holder: expect.any(String),
      $target: expect.any(String),
      grants: expect.any(Array),
    }),
  );
});
