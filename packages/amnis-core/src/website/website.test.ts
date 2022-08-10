import { websiteKey, websiteCreate } from './website.js';

/**
 * ============================================================
 */
test('website key should be is properly set', () => {
  expect(websiteKey).toEqual('website');
});

/**
 * ============================================================
 */
test('should create a website', () => {
  const website = websiteCreate({
    name: 'Amnis',
    url: 'https://amnis.dev',
  });

  expect(website).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      url: expect.any(String),
    }),
  );
});
