import { auditKey, auditCreate } from './audit.js';

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
    completed: true,
  });

  expect(audit).toEqual(
    expect.objectContaining({
      action: 'Testing',
      completed: true,
    }),
  );
});
