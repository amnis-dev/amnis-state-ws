import { dateNumeric, reference } from '../core';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Session } from './session.types';

export const sessionKey = 'session';

export const sessionBase: EntityExtension<Session> = {
  $subject: reference('user'),
  exp: dateNumeric(),
  admin: false,
  name: 'Unnamed Session Holder',
  dmn: '',
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
