import { dateNumeric, entityCreate, reference } from '@amnis/core/index';
import { sessionKey } from './session';
import type { Session } from './session.types';

export const sessionDefault: Session = entityCreate<Session>(sessionKey, {
  $subject: reference('user', ''),
  exp: dateNumeric(),
  admin: false,
  tokens: [],
  displayName: 'Unknown Session Holder',
  org: '',
  avatar: null,
});

export default sessionDefault;
