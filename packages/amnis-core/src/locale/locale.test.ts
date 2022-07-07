import {
  localeKey, localeCreate, t, tk,
} from './locale';
import { localeDataEnLogs } from './locale.locale.en';

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
  const locale = localeCreate({
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
  const text = t(localeDataEnLogs.t, tk('error_required_name_desc'), 'system');

  expect(text).toEqual('The system name must be defined.');
});
