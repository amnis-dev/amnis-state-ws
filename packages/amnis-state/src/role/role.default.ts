import { entityCreate } from '@amnis/core/index';
import { roleKey } from './role';
import type { Role } from './role.types';

export const roleDefault: Role = entityCreate<Role>(roleKey, {
  name: 'Base',
  description: 'Base role for a registered user account.',
  color: '#000000',
  grants: [],
});

export default roleDefault;
