import { dateNumeric, reference } from '@amnis/core/core';
import { TokenDecoded } from '@amnis/core/types';
import { tokenDecode, tokenEncode, tokenVerify } from './token';

const SECRET_TEST = 'super-secret-12345';

const tokenObject: TokenDecoded = {
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

const jwtTokenRegex = /^(?:[\w-]*\.){2}[\w-]*$/;

/**
 * ============================================================
 */
test('token should be encoded.', () => {
  const encoded = tokenEncode(tokenObject, SECRET_TEST);

  expect(encoded).toMatch(jwtTokenRegex);
});

/**
 * ============================================================
 */
test('token should be decoded.', () => {
  const encoded = tokenEncode(tokenObject, SECRET_TEST);
  const decoded = tokenDecode(encoded);

  expect(decoded).toEqual(tokenObject);
});

/**
 * ============================================================
 */
test('token should be fail verification with bad secret.', () => {
  const encoded = tokenEncode(tokenObject, SECRET_TEST);
  const decoded = tokenVerify(encoded, 'bad-secret-54321');

  expect(decoded).not.toBeDefined();
});

/**
 * ============================================================
 */
test('token should be verified with matching secret.', () => {
  const encoded = tokenEncode(tokenObject, SECRET_TEST);
  const decoded = tokenVerify(encoded, SECRET_TEST);

  expect(decoded).toBeDefined();
  expect(decoded).toEqual(tokenObject);
});
