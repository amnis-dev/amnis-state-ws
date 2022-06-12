import {
  dateNumeric, entityCreate, reference, surl, tokenStringify,
} from '@amnis/core/core';
import { Session, JWTDecoded, Token } from '@amnis/core/types';
import { passCompare, passCreate } from './pass';
import { sessionCookieCreate, sessionCookieParse } from './session';
import { jwtDecode, jwtEncode, jwtVerify } from './token';

const SECRET_TEST = 'super-secret-code-123456789';

const jwtDecoded: JWTDecoded = {
  iss: 'core',
  sub: reference('user', '1234'),
  exp: dateNumeric(new Date(Date.now() + 60 * 1000)),
  iat: dateNumeric(),
  typ: 'access',
  roles: [
    reference('role', '1'),
    reference('role', '2'),
  ],
};

const token: Token = {
  api: 'Core',
  exp: jwtDecoded.exp,
  jwt: jwtEncode(jwtDecoded, SECRET_TEST),
  type: 'access',
};

const session: Session = entityCreate('session', {
  $subject: reference('user', '1234'),
  exp: jwtDecoded.exp,
  admin: false,
  tokens: [
    tokenStringify(token),
  ],
  displayName: '',
  org: '',
  avatar: surl('https://amnis.dev/avatar.png'),
});

const jwtTokenRegex = /^(?:[\w-]*\.){2}[\w-]*$/;

/**
 * ============================================================
 */
test('token should be encoded.', () => {
  const encoded = jwtEncode(jwtDecoded, SECRET_TEST);

  expect(encoded).toMatch(jwtTokenRegex);
});

/**
 * ============================================================
 */
test('token encoding should throw error with weak secret.', () => {
  expect(() => {
    jwtEncode(jwtDecoded, '1234');
  }).toThrowError('Secret not set or strong enough.');
});

/**
 * ============================================================
 */
test('token should be decoded.', () => {
  const encoded = jwtEncode(jwtDecoded, SECRET_TEST);
  const decoded = jwtDecode(encoded);

  expect(decoded).toEqual(jwtDecoded);
});

/**
 * ============================================================
 */
test('token should be fail verification with bad secret.', () => {
  const encoded = jwtEncode(jwtDecoded, SECRET_TEST);
  const decoded = jwtVerify(encoded, 'bad-secret-54321');

  expect(decoded).not.toBeDefined();
});

/**
 * ============================================================
 */
test('token should be verified with matching secret.', () => {
  const encoded = jwtEncode(jwtDecoded, SECRET_TEST);
  const decoded = jwtVerify(encoded, SECRET_TEST);

  expect(decoded).toBeDefined();
  expect(decoded).toEqual(jwtDecoded);
});

/**
 * ============================================================
 */
test('pass should become hashed.', async () => {
  const plaintext = 'myPlainPassword';
  const hashed = await passCreate(plaintext);

  expect(hashed).not.toEqual(plaintext);
});

/**
 * ============================================================
 */
test('pass should match with same hashed plaintext.', async () => {
  const plaintext = 'myPlainPassword';
  const hashed = await passCreate(plaintext);

  const same = await passCompare(plaintext, hashed);

  expect(same).toEqual(true);
});

/**
 * ============================================================
 */
test('pass should NOT match with mismatched hashed plaintext.', async () => {
  const plaintext = 'myPlainPassword';
  const hashed = await passCreate(plaintext);

  const same = await passCompare('notMyPlainPassword', hashed);

  expect(same).toEqual(false);
});

/**
 * ============================================================
 */
test('session cookie should be serialized.', () => {
  const sessionCookie = sessionCookieCreate(session, SECRET_TEST);

  expect(sessionCookie).toBeDefined();
});

/**
 * ============================================================
 */
test('session cookie should throw error with weak secret.', () => {
  expect(() => {
    sessionCookieCreate(session, '1234');
  }).toThrowError('Secret not set or strong enough.');
});

/**
 * ============================================================
 */
test('session cookie should be serialized.', () => {
  const sessionCookie = sessionCookieCreate(session, SECRET_TEST);

  expect(sessionCookie).toBeDefined();
  expect(typeof sessionCookie === 'string').toBe(true);
});

/**
 * ============================================================
 */
test('session cookie should be parsed to session object.', () => {
  const sessionCookie = sessionCookieCreate(session, SECRET_TEST);
  const sessionParsed = sessionCookieParse(sessionCookie, SECRET_TEST);

  const { iat } = sessionParsed;

  expect(sessionParsed).toBeDefined();
  expect(typeof iat === 'number').toBe(true);
  expect(sessionParsed).toEqual({ ...session, iat });
});
