import { uid } from '../uid.js';
import { systemKey, systemCreate } from './system.js';

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
    $adminRole: uid('role'),
    $execRole: uid('role'),
    $initialRoles: [uid('role')],
  });

  expect(system).toEqual(
    expect.objectContaining({
      name: expect.any(String),
    }),
  );
});
