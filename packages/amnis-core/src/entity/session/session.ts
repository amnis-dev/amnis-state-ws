import { uid } from '../../uid.js';
import { dateNumeric } from '../../core.js';
import type {
  EntityCreatorBase,
  EntityCreatorParams,
} from '../entity.types.js';
import type { Session } from './session.types.js';

export const sessionKey = 'session';

export const sessionBase: EntityCreatorBase<Session> = {
  $subject: uid('user'),
  exp: dateNumeric(),
  admin: false,
  name: 'Unnamed Session Holder',
  avatar: null,
};

export function sessionCreator(
  session: EntityCreatorParams<Session, '$subject' | 'exp' | 'name'>,
): Session {
  return {
    ...sessionBase,
    ...session,
    $id: uid(sessionKey),
  };
}
