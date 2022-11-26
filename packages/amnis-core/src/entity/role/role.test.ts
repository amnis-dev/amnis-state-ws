import { roleKey, roleCreator } from './role.js';

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
  const role = roleCreator({
    name: 'Base Role',
  });

  expect(role).toEqual(
    expect.objectContaining({
      name: expect.any(String),
    }),
  );
});
