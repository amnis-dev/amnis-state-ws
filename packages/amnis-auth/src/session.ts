import { Session } from '@amnis/core/types';
// import { serialize, parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { AUTH_SESSION_SECRET } from './const';

// const SESSION_COOKIE_NAME = 'session';
// const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

/**
 * Encode a session.
 */
export function sessionEncode(session: Session, secret = AUTH_SESSION_SECRET) {
  const sessionToken = jwt.sign(session, secret);
  return sessionToken;
}

/**
 * Decode a session.
 */
export function sessionVerify(
  sessionEncoded: string,
  secret = AUTH_SESSION_SECRET,
): Session | undefined {
  try {
    const decoded = jwt.verify(sessionEncoded, secret) as Session;

    return decoded;
  } catch (error) {
    return undefined;
  }
}

/**
 * Cookie methods not needed in the lib, but keeping for example purposes.
 */

// /**
//  * Creates a secure session cookie from a session object.
//  *
//  * @example
//  * ```
//  * const sessionCookie = sessionCookieCreate({...}, MY_SECRET_KEY);
//  * response.setHeader('Set-Cookie', sessionCookie);
//  * ```
//  */
// export function sessionCookieCreate(session: Session, secret: string) {
//   if (secret.length < 21) {
//     throw new Error('Secret not set or strong enough.');
//   }

//   const { exp } = session;

//   // Create session token.
//   const sessionToken = jwt.sign(session, secret);

//   const cookie = serialize(SESSION_COOKIE_NAME, sessionToken, {
//     maxAge: MAX_AGE,
//     expires: new Date(exp),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     path: '/',
//     sameSite: 'lax',
//   });

//   return cookie;
// }

// /**
//  * Returns an expired session cookie.
//  *
//  * @example
//  * ```
//  * response.setHeader('Set-Cookie', sessionCookieRemover());
//  * ```
//  */
// export function sessionCookieRemover() {
//   const cookie = serialize(SESSION_COOKIE_NAME, '', {
//     maxAge: -1,
//     path: '/',
//   });

//   return cookie;
// }

// /**
//  * Returns the session object from a the 'Set-Cookie` header string.
//  */
// export function sessionCookieParse(headerCookie: string, secret: string): Session {
//   const cookies = parse(headerCookie || '');
//   const session = jwt.verify(cookies[SESSION_COOKIE_NAME], secret) as Session;

//   return session;
// }

export default {
  sessionEncode,
  sessionVerify,
};
