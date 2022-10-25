import {
  uid, dateNumeric, sessionCreate, userKey,
} from '@amnis/core';

export const sessionDefault = sessionCreate({
  $subject: uid(userKey),
  exp: dateNumeric(),
  admin: false,
  name: 'Unknown Session Holder',
});

export default sessionDefault;
