import { apiKey, apiCreator, apiBase } from './api.js';

/**
 * ============================================================
 */
test('api key should be is properly set', () => {
  expect(apiKey).toEqual('api');
});

/**
 * ============================================================
 */
test('should create a api', () => {
  const api = apiCreator(apiBase);

  expect(api).toEqual(
    expect.objectContaining(apiBase),
  );
});
