import {
  uid,
  dateNumeric,
  surl,
  JWTAccess,
  Session,
  entityCreate,
} from '@amnis/core';

import { passCompare, passCreate } from './pass.js';
import { sessionEncode, sessionVerify } from './session.js';
import { jwtDecode, jwtEncode, jwtVerify } from './token.js';
import { generateRsa } from './rsa.js';

const SECRET_TEST = 'super-secret-code-123456789';

const rsaKeyPair1 = generateRsa();
const rsaKeyPair2 = generateRsa();

const jwtDecoded: JWTAccess = {
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

const jwtDecodedExpired: JWTAccess = {
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
test('bearer should be encoded.', () => {
  const encoded = jwtEncode(jwtDecoded, rsaKeyPair1.privateKey);

  expect(encoded).toMatch(jwtTokenRegex);
});

/**
 * ============================================================
 */
test('bearer should be decoded.', () => {
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
test('bearer should be fail verification with bad secret.', () => {
  const encoded = jwtEncode(jwtDecoded, rsaKeyPair1.privateKey);
  const decoded = jwtVerify(encoded, rsaKeyPair2.publicKey);

  expect(decoded).not.toBeDefined();
});

/**
 * ============================================================
 */
test('bearer should be verified with matching secret.', () => {
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
test('expired bearer should fail verification.', () => {
  const encoded = jwtEncode(jwtDecodedExpired, rsaKeyPair1.privateKey);
  const decoded = jwtVerify(encoded, rsaKeyPair1.publicKey);

  expect(decoded).not.toBeDefined();
});

/**
 * ============================================================
 */
test('pass should become hashed.', async () => {
  const plaintext = 'myPlainPassword';
  const hashed = passCreate(plaintext);

  expect(hashed).not.toEqual(plaintext);
});

/**
 * ============================================================
 */
test('pass should match with same hashed plaintext.', async () => {
  const plaintext = 'myPlainPassword';
  const hashed = passCreate(plaintext);

  const same = passCompare(plaintext, hashed);

  expect(same).toEqual(true);
});

/**
 * ============================================================
 */
test('pass should NOT match with mismatched hashed plaintext.', async () => {
  const plaintext = 'myPlainPassword';
  const hashed = passCreate(plaintext);

  const same = passCompare('notMyPlainPassword', hashed);

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
