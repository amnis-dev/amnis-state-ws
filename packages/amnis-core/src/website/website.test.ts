import { websiteKey, websiteCreate } from './website';

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
  const [website, logs] = websiteCreate({
    name: 'Amnis',
    domain: 'https://amnis.dev',
  });

  expect(website).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      domain: expect.any(String),
    }),
  );

  expect(logs).toHaveLength(0);
});
