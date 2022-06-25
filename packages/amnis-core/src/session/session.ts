import { dateNumeric, reference } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
import type { Session } from './session.types';

export const sessionKey = 'session';

export const sessionBase: EntityExtension<Session> = {
  $subject: reference('user'),
  exp: dateNumeric(),
  admin: false,
  tokens: [],
  name: 'Unnamed Session Holder',
  dmn: '',
  avatar: null,
};

/**
 * Session check method.
 */
export function sessionCheck(session: Session): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function sessionCreate(
  session: EntityExtensionCreate<Session, '$subject' | 'exp' | 'name'>,
  checkSkip = false,
): [Session, Log[]] {
  const sessionEntity = entityCreate<Session>(sessionKey, {
    ...sessionBase,
    ...session,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...sessionCheck(sessionEntity));
  }

  return [sessionEntity, logs];
}
