import { identifier } from '../core';
import { systemKey, systemCreate } from './system';

/**
 * ============================================================
 */
test('system key should be is properly set', () => {
  expect(systemKey).toEqual('system');
});

/**
 * ============================================================
 */
test('should create a system', () => {
  const system = systemCreate({
    name: 'Amnis System',
    $adminRole: identifier('role'),
    $initialRoles: [identifier('role')],
  });

  expect(system).toEqual(
    expect.objectContaining({
      name: expect.any(String),
    }),
  );
});
