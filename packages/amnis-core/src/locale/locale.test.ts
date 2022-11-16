import {
  localeKey, localeCreator, t, tk,
} from './locale.js';
import { localeDataEnLogs } from './locale.locale.en.js';

/**
 * ============================================================
 */
test('locale key should be is properly set', () => {
  expect(localeKey).toEqual('locale');
});

/**
 * ============================================================
 */
test('should create a locale', () => {
  const locale = localeCreator({
    code: 'en',
    set: 'core',
  });

  expect(locale).toEqual(
    expect.objectContaining({
      code: 'en',
      set: 'core',
      t: expect.any(Object),
    }),
  );
});

/**
 * ============================================================
 */
test('should translate existing key', () => {
  const text = t(localeDataEnLogs.t, tk('error_required_name_title'));

  expect(text).toEqual('Name Required');
});

/**
 * ============================================================
 */
test('should translate existing key with args', () => {
  const text = t(localeDataEnLogs.t, tk('error_required_name_desc'), ...localeDataEnLogs.v);

  expect(text).toEqual('The system name must be defined.');
});
