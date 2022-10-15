import { roleKey, roleCreate } from './role.js';

/**
 * ============================================================
 */
test('role key should be is properly set', () => {
  expect(roleKey).toEqual('role');
});

/**
 * ============================================================
 */
test('should create a role', () => {
  const role = roleCreate({
    name: 'Base Role',
  });

  expect(role).toEqual(
    expect.objectContaining({
      name: expect.any(String),
    }),
  );
});
