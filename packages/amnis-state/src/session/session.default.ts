import { entityCreate } from '@amnis/core/index';
import { sessionKey } from './session';
import type { Session } from './session.types';

export const sessionDefault: Session = entityCreate<Session>(sessionKey, {
  myProperty: '',
});

export default sessionDefault;
