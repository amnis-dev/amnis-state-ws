import {
  dateNumeric, surl,
} from '@amnis/core/core';
import { uid } from '@amnis/core/uid';
import { JWTDecoded } from '@amnis/core/token';
import { Session } from '@amnis/core/session';
import { entityCreate } from '@amnis/core/entity';

import { passCompare, passCreate } from './pass';
import { sessionEncode, sessionVerify } from './session';
import { jwtDecode, jwtEncode, jwtVerify } from './token';
import { generateRsa } from './rsa';

const SECRET_TEST = 'super-secret-code-123456789';

const rsaKeyPair1 = generateRsa();
const rsaKeyPair2 = generateRsa();

const jwtDecoded: JWTDecoded = {
  iss: 'core',
  sub: uid('user', '1234'),
  exp: dateNumeric(new Date(Date.now() + 60 * 1000)),
  iat: dateNumeric(),
  typ: 'access',
  roles: [
    uid('role', '1'),
    uid('role', '2'),
  ],
};

const jwtDecodedExpired: JWTDecoded = {
  iss: 'core',
  sub: uid('user', '1234'),
  exp: dateNumeric(),
  iat: dateNumeric(),
  typ: 'access',
  roles: [
    uid('role', '1'),
    uid('role', '2'),
  ],
};

const session: Session = entityCreate('session', {
  $subject: uid('user', '1234'),
  exp: jwtDecoded.exp,
  admin: false,
  name: '',
  avatar: surl('https://amnis.dev/avatar.png'),
});

const sessionExpired: Session = entityCreate('session', {
  $subject: uid('user', '1234'),
  exp: dateNumeric(),
  admin: false,
  name: '',
  avatar: surl('https://amnis.dev/avatar.png'),
});

const jwtTokenRegex = /^(?:[\w-]*\.){2}[\w-]*$/;

/**
 * ============================================================
 */
test('token should be encoded.', () => {
  const encoded = jwtEncode(jwtDecoded, rsaKeyPair1.privateKey);

  expect(encoded).toMatch(jwtTokenRegex);
});

/**
 * ============================================================
 */
test('token should be decoded.', () => {
  const encoded = jwtEncode(jwtDecoded, rsaKeyPair1.privateKey);
  const decoded = jwtDecode(encoded);

  expect(decoded).toEqual({
    ...jwtDecoded,
    exp: Math.floor(jwtDecoded.exp / 1000) * 1000,
  });
});

/**
 * ============================================================
 */
test('token should be fail verification with bad secret.', () => {
  const encoded = jwtEncode(jwtDecoded, rsaKeyPair1.privateKey);
  const decoded = jwtVerify(encoded, rsaKeyPair2.publicKey);

  expect(decoded).not.toBeDefined();
});

/**
 * ============================================================
 */
test('token should be verified with matching secret.', () => {
  const encoded = jwtEncode(jwtDecoded, rsaKeyPair1.privateKey);
  const decoded = jwtVerify(encoded, rsaKeyPair1.publicKey);

  expect(decoded).toBeDefined();
  expect(decoded).toEqual({
    ...jwtDecoded,
    exp: Math.floor(jwtDecoded.exp / 1000) * 1000,
  });
});

/**
 * ============================================================
 */
test('expired token should fail verification.', () => {
  const encoded = jwtEncode(jwtDecodedExpired, rsaKeyPair1.privateKey);
  const decoded = jwtVerify(encoded, rsaKeyPair1.publicKey);

  expect(decoded).not.toBeDefined();
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
  expect(sessionDecoded).toEqual({
    ...session,
    exp: Math.floor(session.exp / 1000) * 1000,
  });
});

/**
 * ============================================================
 */
test('expired session should be NOT be verified.', () => {
  const encoded = sessionEncode(sessionExpired, SECRET_TEST);
  const decoded = sessionVerify(encoded, SECRET_TEST);

  expect(decoded).not.toBeDefined();
});
