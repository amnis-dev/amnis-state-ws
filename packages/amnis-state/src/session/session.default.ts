import { identifier, dateNumeric } from '@amnis/core/core';
import { sessionCreate } from '@amnis/core/session';
import { userKey } from '@amnis/core/user';

export const sessionDefault = sessionCreate({
  $subject: identifier(userKey),
  exp: dateNumeric(),
  admin: false,
  name: 'Unknown Session Holder',
});

export default sessionDefault;
