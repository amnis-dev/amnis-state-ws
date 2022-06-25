import { entityCreate } from '@amnis/core/index';
import { systemKey } from './system';
import type { System } from './system.types';

export const systemDefault: System = entityCreate<System>(systemKey, {
  myProperty: 'Unnamed',
});

export default systemDefault;
