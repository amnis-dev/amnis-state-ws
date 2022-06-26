import { reference } from '../core';
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
  const [permit, logs] = permitCreate({
    $issuer: reference('user'),
    $holder: reference('user'),
    $target: reference('entity'),
  });

  expect(permit).toEqual(
    expect.objectContaining({
      $issuer: expect.any(String),
      $holder: expect.any(String),
      $target: expect.any(String),
      grants: expect.any(Array),
    }),
  );

  expect(logs).toHaveLength(0);
});
