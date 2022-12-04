import { challengeCreator } from '../entity/index.js';
import { cryptoWeb } from './index.js';
import { authRegistrationCreate, authRegistrationParse } from './io.auth.js';

test('should create a valid auth registration object', async () => {
  const username = 'test_user';
  const challenge = challengeCreator({
    value: await cryptoWeb.randomString(),
  });

  const [authRegistration] = await authRegistrationCreate({
    agent: 'Jest Test Device',
    username,
    password: 'passwd12',
    challenge,
  });

  expect(authRegistration).toMatchObject({
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

  const [authRegistration, privateKeyWrapped] = await authRegistrationCreate({
    agent: 'Jest Test Device',
    username,
    password: 'passwd12',
    challenge,
  });

  expect(typeof privateKeyWrapped === 'string').toBe(true);

  const authRegistrationParsed = await authRegistrationParse(authRegistration);

  if ('level' in authRegistrationParsed) {
    expect(authRegistrationParsed.level).toBeUndefined();
    return;
  }

  expect(authRegistrationParsed).toMatchObject({
    username: 'test_user',
    challenge: expect.any(Object),
    type: 'auth.create',
    origin: 'http://localhost',
    credential: expect.any(Object),
    signature: expect.any(ArrayBuffer),
  });

  expect(authRegistrationParsed.challenge).toMatchObject({
    value: expect.any(String),
    expires: expect.any(Number),
  });

  expect(authRegistrationParsed.credential).toMatchObject({
    name: 'Jest Test Device',
    publicKey: expect.any(String),
  });
});
