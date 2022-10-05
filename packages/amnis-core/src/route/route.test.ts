import { routeKey, routeCreate, routeBase } from './route';

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
  const route = routeCreate(routeBase);

  expect(route).toEqual(
    expect.objectContaining(routeBase),
  );
});
