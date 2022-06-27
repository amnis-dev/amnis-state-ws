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
  const [system, logs] = systemCreate({
    name: 'Amnis System',
  });

  expect(system).toEqual(
    expect.objectContaining({
      name: expect.any(String),
    }),
  );

  expect(logs).toHaveLength(0);
});