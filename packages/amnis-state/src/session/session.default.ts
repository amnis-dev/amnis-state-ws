import { uid } from '@amnis/core/uid.js';
import { dateNumeric } from '@amnis/core/core.js';
import { sessionCreate } from '@amnis/core/session/index.js';
import { userKey } from '@amnis/core/user/index.js';

export const sessionDefault = sessionCreate({
  $subject: uid(userKey),
  exp: dateNumeric(),
  admin: false,
  name: 'Unknown Session Holder',
});

export default sessionDefault;
