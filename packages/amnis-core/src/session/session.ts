import { dateNumeric, reference } from '../core.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import type { Session } from './session.types.js';

export const sessionKey = 'session';

export const sessionBase: EntityExtension<Session> = {
  $subject: reference('user'),
  exp: dateNumeric(),
  admin: false,
  name: 'Unnamed Session Holder',
  dmn: '',
  avatar: null,
};

/**
 * Session check method.
 */
export function sessionCheck(session: Session): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function sessionCreate(
  session: EntityExtensionCreate<Session, '$subject' | 'exp' | 'name'>,
): Session {
  const sessionEntity = entityCreate<Session>(sessionKey, {
    ...sessionBase,
    ...session,
  });

  return sessionEntity;
}
