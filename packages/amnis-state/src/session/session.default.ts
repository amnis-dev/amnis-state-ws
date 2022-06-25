import {
  Session, dateNumeric, entityCreate, reference,
} from '@amnis/core/index';
import { sessionKey } from './session';

export const sessionDefault: Session = entityCreate<Session>(sessionKey, {
  $subject: reference('user'),
  exp: dateNumeric(),
  admin: false,
  tokens: [],
  name: 'Unknown Session Holder',
  dmn: '',
  avatar: null,
});

export default sessionDefault;
