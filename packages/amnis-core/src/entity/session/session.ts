import { uid } from '../../uid.js';
import { dateNumeric } from '../../core.js';
import type {
  EntityExtension,
  EntityExtensionCreate,
  EntityCreator,
} from '../entity.types.js';
import type { Session } from './session.types.js';

export const sessionKey = 'session';

export const sessionBase: EntityExtension<Session> = {
  $subject: uid('user'),
  exp: dateNumeric(),
  admin: false,
  name: 'Unnamed Session Holder',
  avatar: null,
};

export function sessionCreator(
  session: EntityExtensionCreate<Session, '$subject' | 'exp' | 'name'>,
): EntityCreator<Session> {
  return {
    ...sessionBase,
    ...session,
    $id: uid(sessionKey),
  };
}
