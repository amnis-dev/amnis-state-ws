import { sheetKey, sheetCreator } from './sheet.js';

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
  const sheet = sheetCreator({
    data: {},
  });

  expect(sheet).toEqual(
    expect.objectContaining({
      data: {},
    }),
  );
});
