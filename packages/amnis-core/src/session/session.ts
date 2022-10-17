import { uid } from '../uid.js';
import { dateNumeric } from '../core.js';
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { Session } from './session.types.js';

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
