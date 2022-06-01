import { dateJSON, entityCreate, reference } from '@amnis/core/index';
import type { Session } from '@amnis/core/types';
import { userKey } from '../user';
import { sessionKey } from './session';

export const sessionDefault: Session = entityCreate<Session>(sessionKey, {
  name: 'eCrow',
  $user: reference(userKey, ''),
  grants: [],
  expires: dateJSON(),
});

export default sessionDefault;
