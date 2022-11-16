import { routeKey, routeCreator, routeBase } from './route.js';

/**
 * ============================================================
 */
test('route key should be is properly set', () => {
  expect(routeKey).toEqual('route');
});

/**
 * ============================================================
 */
test('should create a route', () => {
  const route = routeCreator(routeBase);

  expect(route).toEqual(
    expect.objectContaining(routeBase),
  );
});
