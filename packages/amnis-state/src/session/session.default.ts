import { reference, dateNumeric } from '@amnis/core/core';
import { sessionCreate } from '@amnis/core/session';
import { userKey } from '@amnis/core/user';

export const [sessionDefault] = sessionCreate({
  $subject: reference(userKey),
  exp: dateNumeric(),
  admin: false,
  tokens: [],
  name: 'Unknown Session Holder',
  dmn: '',
});

export default sessionDefault;
