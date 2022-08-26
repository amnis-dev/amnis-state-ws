import { sheetKey, sheetCreate } from './sheet';

/**
 * ============================================================
 */
test('sheet key should be is properly set', () => {
  expect(sheetKey).toEqual('sheet');
});

/**
 * ============================================================
 */
test('should create a sheet', () => {
  const sheet = sheetCreate({
    data: {},
  });

  expect(sheet).toEqual(
    expect.objectContaining({
      data: {},
    }),
  );
});
