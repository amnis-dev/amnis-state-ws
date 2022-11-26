import { websiteKey, websiteCreator } from './website.js';

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
  const website = websiteCreator({
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
