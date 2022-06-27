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
  const [log] = logCreate({
    title: '',
    description: '',
    level: 'error',
  });

  expect(log).toEqual(
    expect.objectContaining({
      title: expect.any(String),
      description: expect.any(String),
      level: expect.any(String),
    }),
  );
});
