import { reference } from '@amnis/core/core';
import { systemCreate } from '@amnis/core/system';
import { roleKey } from '../role';

export const systemDefault = systemCreate({
  name: 'Amnis System',
  $adminRole: reference(roleKey),
});

export default systemDefault;
