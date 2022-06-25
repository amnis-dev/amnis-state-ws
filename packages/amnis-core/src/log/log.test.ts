import { logKey, logCreate } from './log';

/**
 * ============================================================
 */
test('log key should be is properly set', () => {
  expect(logKey).toEqual('log');
});

/**
 * ============================================================
 */
test('should create a log', () => {
  const [log, logs] = logCreate({
    prop: null,
  });

  expect(log).toEqual(
    expect.objectContaining({
      prop: null,
    }),
  );

  expect(logs).toHaveLength(0);
});
