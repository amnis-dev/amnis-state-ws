import { challengeCreator } from '../entity/index.js';
import { cryptoWeb } from '../index.js';
import { apiAuthRegistrationCreate, apiAuthRegistrationParse } from './api.auth.js';

test('should create a valid auth registration object', async () => {
  const handle = 'test_user';
  const displayName = 'Test User';
  const challenge = challengeCreator({
    value: await cryptoWeb.randomString(),
  });

  const [authRegistration] = await apiAuthRegistrationCreate({
    handle,
    displayName,
    password: 'passwd12',
    challenge,
  });

  expect(authRegistration).toMatchObject({
    handle: 'test_user',
    displayName: 'Test User',
    challenge: expect.any(String),
    type: 'auth.create',
    origin: 'http://localhost',
    credential: expect.any(String),
    signature: expect.any(String),
  });
});

test('should be able to parse a generated auth registration object', async () => {
  const handle = 'test_user';
  const displayName = 'Test User';
  const challenge = challengeCreator({
    value: await cryptoWeb.randomString(),
  });

  const [authRegistration, privateKeyWrapped] = await apiAuthRegistrationCreate({
    handle,
    displayName,
    password: 'passwd12',
    challenge,
  });

  expect(typeof privateKeyWrapped === 'string').toBe(true);

  const authRegistrationParsed = await apiAuthRegistrationParse(authRegistration);

  if (!authRegistrationParsed) {
    expect(authRegistrationParsed).toBeDefined();
    return;
  }

  expect(authRegistrationParsed).toMatchObject({
    handle: 'test_user',
    displayName: 'Test User',
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
    name: expect.any(String),
    publicKey: expect.any(String),
  });
});
