import { Entity, entityCreate } from '../entity';
import type { Route, RouteBase, RouteBaseCreate } from './route.types';

export const routeKey = 'route';

export const routeBase: RouteBase = {
  label: '',
  path: '/',
};

export function routeCreate(
  route: RouteBaseCreate,
  entity: Partial<Entity> = {},
): Route {
  const routeEntity = entityCreate<Route>(routeKey, {
    ...routeBase,
    ...route,
  }, entity);

  return routeEntity;
}
