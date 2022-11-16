import { dateJSON } from '../core.js';
import type { EntityCreator } from '../entity/index.js';
import { uid } from '../uid.js';
import type { Service, ServiceBase, ServiceBaseCreate } from './service.types.js';

export const serviceKey = 'service';

export const serviceBase: ServiceBase = {
  name: 'Unknown Service',
  status: 'offline',
  dateChecked: dateJSON(),
};

export function serviceCreator(
  service: ServiceBaseCreate,
): EntityCreator<Service> {
  return {
    ...serviceBase,
    dateChecked: dateJSON(),
    ...service,
    $id: uid(serviceKey),
  };
}
