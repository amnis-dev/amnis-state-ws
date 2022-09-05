import { dateJSON } from '../core';
import { auditKey, auditCreate } from './audit';

/**
 * ============================================================
 */
test('audit key should be is properly set', () => {
  expect(auditKey).toEqual('audit');
});

/**
 * ============================================================
 */
test('should create a audit', () => {
  const audit = auditCreate({
    action: 'Testing',
    dateInvoked: dateJSON(),
    completed: true,
  });

  expect(audit).toEqual(
    expect.objectContaining({
      action: 'Testing',
      dateInvoked: expect.any(String),
      completed: true,
    }),
  );
});
