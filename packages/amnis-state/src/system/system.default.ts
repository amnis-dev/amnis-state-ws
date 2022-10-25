import { roleKey, systemCreate, uid } from '@amnis/core';

export const systemDefault = systemCreate({
  name: 'Amnis System',
  $adminRole: uid(roleKey),
});

export default systemDefault;
