import { roleCreate } from '@amnis/core/role';

export const [roleDefault] = roleCreate({
  name: 'Base',
  description: 'Base role for a registered user account.',
  color: '#000000',
  grants: [],
});

export default roleDefault;
