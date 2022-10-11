import { uid } from '../uid';
import { dateNumeric } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Session } from './session.types';

export const sessionKey = 'session';

export const sessionBase: EntityExtension<Session> = {
  $subject: uid('user'),
  exp: dateNumeric(),
  admin: false,
  name: 'Unnamed Session Holder',
  avatar: null,
};

export function sessionCreate(
  session: EntityExtensionCreate<Session, '$subject' | 'exp' | 'name'>,
): Session {
  const sessionEntity = entityCreate<Session>(sessionKey, {
    ...sessionBase,
    ...session,
  });

  return sessionEntity;
}
