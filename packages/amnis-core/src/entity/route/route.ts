import type { EntityCreator } from '../entity.types.js';
import { uid } from '../../uid.js';
import type { Route, RouteBase, RouteCreator } from './route.types.js';

export const routeKey = 'route';

export const routeBase: RouteBase = {
  label: '',
  path: '/',
};

export function routeCreator(
  route: RouteCreator,
): EntityCreator<Route> {
  return {
    ...routeBase,
    ...route,
    $id: uid(routeKey),
  };
}
