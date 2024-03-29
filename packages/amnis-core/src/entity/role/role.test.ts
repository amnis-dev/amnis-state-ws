import { roleKey, roleCreator, roleFsLimitsCompress } from './role.js';
import { RoleFsLimits } from './role.types.js';

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

test('should compress a list of filesystem limits', () => {
  const limit1: RoleFsLimits = [-1, 32, 0];
  const limit2: RoleFsLimits = [64, 16, 32];
  const limit3: RoleFsLimits = [512, 128, 16];

  const limitResult = roleFsLimitsCompress([
    limit1,
    limit2,
    limit3,
  ]);

  expect(limitResult).toEqual([-1, 128, 32]);
});
