import { uid } from '@amnis/core/uid';
import { systemCreate } from '@amnis/core/system';
import { roleKey } from '../role';

export const systemDefault = systemCreate({
  name: 'Amnis System',
  $adminRole: uid(roleKey),
});

export default systemDefault;
