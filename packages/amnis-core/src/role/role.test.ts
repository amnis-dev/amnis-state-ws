import { roleKey, roleCreate } from './role';

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
  const [role, logs] = roleCreate({
    name: 'Base Role',
  });

  expect(role).toEqual(
    expect.objectContaining({
      name: expect.any(String),
    }),
  );

  expect(logs).toHaveLength(0);
});
