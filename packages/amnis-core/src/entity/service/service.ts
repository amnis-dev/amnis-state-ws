import { dateJSON } from '../../core.js';
import type { EntityCreator } from '../entity.types.js';
import { uid } from '../../uid.js';
import type { Service, ServiceBase, ServiceCreator } from './service.types.js';

export const serviceKey = 'service';

export const serviceBase: ServiceBase = {
  name: 'Unknown Service',
  status: 'offline',
  dateChecked: dateJSON(),
};

export function serviceCreator(
  service: ServiceCreator,
): EntityCreator<Service> {
  return {
    ...serviceBase,
    dateChecked: dateJSON(),
    ...service,
    $id: uid(serviceKey),
  };
}
