import {
  entityCreate, reference, System,
} from '@amnis/core/index';
import { systemKey } from './system';

export const systemDefault: System = entityCreate<System>(systemKey, {
  name: 'Unnamed System',
  sessionExpires: 3600000,
  $website: reference('website'),
  $initialRoles: [],
});

export default systemDefault;
