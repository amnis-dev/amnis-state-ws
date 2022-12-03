import { challengeCreator } from '../entity/index.js';
import { cryptoWeb } from './index.js';
import { authRegisterCreate, authRegisterParse } from './io.auth.js';

test('should create a valid auth registration object', async () => {
  const username = 'test_user';
  const challenge = challengeCreator({
    value: await cryptoWeb.randomString(),
  });

  const [authRegister] = await authRegisterCreate({
    agent: 'Jest Test Device',
    username,
    password: 'passwd12',
    challenge,
  });

  expect(authRegister).toMatchObject({
    username: 'test_user',
    challenge: expect.any(String),
    type: 'auth.create',
    origin: 'http://localhost',
    credential: expect.any(String),
    signature: expect.any(String),
  });
});

test('should be able to parse a generated auth registration object', async () => {
  const username = 'test_user';
  const challenge = challengeCreator({
    value: await cryptoWeb.randomString(),
  });

  const [authRegister, privateKeyWrapped] = await authRegisterCreate({
    agent: 'Jest Test Device',
    username,
    password: 'passwd12',
    challenge,
  });

  expect(typeof privateKeyWrapped === 'string').toBe(true);

  const authRegisterParsed = await authRegisterParse(authRegister);

  if ('level' in authRegisterParsed) {
    expect(authRegisterParsed.level).toBeUndefined();
    return;
  }

  expect(authRegisterParsed).toMatchObject({
    username: 'test_user',
    challenge: expect.any(Object),
    type: 'auth.create',
    origin: 'http://localhost',
    credential: expect.any(Object),
    signature: expect.any(ArrayBuffer),
  });

  expect(authRegisterParsed.challenge).toMatchObject({
    value: expect.any(String),
    expires: expect.any(Number),
  });

  expect(authRegisterParsed.credential).toMatchObject({
    name: 'Jest Test Device',
    publicKey: expect.any(String),
  });
});
