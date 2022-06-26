import {
  dateNumeric, reference, surl,
} from '@amnis/core/index';
import { JWTDecoded, Token, tokenStringify } from '@amnis/core/token';
import { Session } from '@amnis/core/session';
import { entityCreate } from '@amnis/core/entity';

import { passCompare, passCreate } from './pass';
import { sessionEncode, sessionVerify } from './session';
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
  api: 'core',
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
  name: '',
  dmn: '',
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
test('session should be encoded.', () => {
  const encoded = sessionEncode(session, SECRET_TEST);

  expect(encoded).toMatch(jwtTokenRegex);
});

/**
 * ============================================================
 */
test('session should be verified.', () => {
  const encoded = sessionEncode(session, SECRET_TEST);
  const decoded = sessionVerify(encoded, SECRET_TEST);

  const { iat, ...sessionDecoded } = decoded as Session;

  expect(decoded).toBeDefined();
  expect(iat).toEqual(expect.any(Number));
  expect(sessionDecoded).toEqual(session);
});
