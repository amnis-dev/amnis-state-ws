import { historyKey, historyCreate, historyBase } from './history';

/**
 * ============================================================
 */
test('history key should be is properly set', () => {
  expect(historyKey).toEqual('history');
});

/**
 * ============================================================
 */
test('should create a history', () => {
  const history = historyCreate(historyBase);

  expect(history).toEqual(
    expect.objectContaining(historyBase),
  );
});
