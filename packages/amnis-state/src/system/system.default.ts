import { identifier } from '@amnis/core/core';
import { systemCreate } from '@amnis/core/system';
import { roleKey } from '../role';

export const systemDefault = systemCreate({
  name: 'Amnis System',
  $adminRole: identifier(roleKey),
});

export default systemDefault;
