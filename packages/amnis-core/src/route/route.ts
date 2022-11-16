import type { EntityCreator } from '../entity/index.js';
import { uid } from '../uid.js';
import type { Route, RouteBase, RouteBaseCreate } from './route.types.js';

export const routeKey = 'route';

export const routeBase: RouteBase = {
  label: '',
  path: '/',
};

export function routeCreator(
  route: RouteBaseCreate,
): EntityCreator<Route> {
  return {
    ...routeBase,
    ...route,
    $id: uid(routeKey),
  };
}
