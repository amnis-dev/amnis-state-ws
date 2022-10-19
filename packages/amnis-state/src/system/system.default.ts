import { roleKey, systemCreate, uid } from '@amnis/core/index.js';

export const systemDefault = systemCreate({
  name: 'Amnis System',
  $adminRole: uid(roleKey),
});

export default systemDefault;
