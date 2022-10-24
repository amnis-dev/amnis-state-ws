import {
  uid, dateNumeric, sessionCreate, userKey,
} from '@amnis/core/index.js';

export const sessionDefault = sessionCreate({
  $subject: uid(userKey),
  exp: dateNumeric(),
  admin: false,
  name: 'Unknown Session Holder',
});

export default sessionDefault;
