import { userCreate } from '@amnis/core/user/index.js';

export const userDefault = userCreate({
  name: 'Unnamed',
  email: 'unset@amnis.dev',
  password: null,
});

export default userDefault;
