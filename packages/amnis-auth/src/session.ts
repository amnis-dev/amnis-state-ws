import { Session } from '@amnis/core/types';
import { serialize, parse } from 'cookie';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE_NAME = 'coresession';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

/**
 * Creates a secure session cookie from a session object.
 *
 * @example
 * ```
 * const sessionCookie = sessionCookieCreate({...}, MY_SECRET_KEY);
 * response.setHeader('Set-Cookie', sessionCookie);
 * ```
 */
export function sessionCookieCreate(session: Session, secret: string) {
  const { expires } = session;

  // Create session token.
  const sessionToken = jwt.sign(session, secret);

  const cookie = serialize(SESSION_COOKIE_NAME, sessionToken, {
    maxAge: MAX_AGE,
    expires: new Date(expires),
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
  });

  return cookie;
}

/**
 * Returns an expired session cookie.
 *
 * @example
 * ```
 * response.setHeader('Set-Cookie', sessionCookieRemover());
 * ```
 */
export function sessionCookieRemover() {
  const cookie = serialize(SESSION_COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  return cookie;
}

/**
 * Returns the session object from a the 'Set-Cookie` header string.
 */
export function sessionCookieParse(headerCookie: string, secret: string): Session {
  const cookies = parse(headerCookie || '');
  const session = jwt.verify(cookies[SESSION_COOKIE_NAME], secret) as Session;

  return session;
}

export default {
  sessionCookieCreate,
  sessionCookieRemover,
  sessionCookieParse,
};
