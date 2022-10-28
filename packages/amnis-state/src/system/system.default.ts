import { roleKey, systemCreate, uid } from '@amnis/core';

export const systemDefault = systemCreate({
  name: 'Amnis System',
  $adminRole: uid(roleKey),
  $execRole: uid(roleKey),
});

export default systemDefault;
