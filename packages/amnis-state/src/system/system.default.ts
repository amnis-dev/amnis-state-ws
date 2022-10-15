import { uid } from '@amnis/core/uid.js';
import { systemCreate } from '@amnis/core/system/index.js';
import { roleKey } from '../role/index.js';

export const systemDefault = systemCreate({
  name: 'Amnis System',
  $adminRole: uid(roleKey),
});

export default systemDefault;
