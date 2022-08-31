import { dateJSON } from '../core';
import { Entity, entityCreate } from '../entity';
import type { Service, ServiceBase, ServiceBaseCreate } from './service.types';

export const serviceKey = 'service';

export const serviceBase: ServiceBase = {
  name: 'Unknown Service',
  status: 'offline',
  dateChecked: dateJSON(),
};

export function serviceCreate(
  service: ServiceBaseCreate,
  entity: Partial<Entity> = {},
): Service {
  const serviceEntity = entityCreate<Service>(serviceKey, {
    ...serviceBase,
    dateChecked: dateJSON(),
    ...service,
  }, entity);

  return serviceEntity;
}
