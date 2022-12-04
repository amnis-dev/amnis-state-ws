import {
  authRegistrationCreate,
  authRegistrationParse,
  challengeCreator,
  IoContext,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { registerAccount } from './register.js';

let context: IoContext;

beforeAll(async () => {
  context = await contextSetup();
});

test('should register a new account', async () => {
  const challenge = challengeCreator({
    value: await context.crypto.randomString(16),
  });

  const [authRegistration] = await authRegistrationCreate({
    agent: 'Jest Test Agent',
    username: 'new_user',
    password: 'passwd12',
    challenge,
  });

  const authRegistrationParsed = await authRegistrationParse(authRegistration);

  if ('level' in authRegistrationParsed) {
    expect(authRegistrationParsed.level).toBeUndefined();
    return;
  }

  const result = await registerAccount(
    context,
    authRegistrationParsed,
  );

  console.log(JSON.stringify(result, null, 2));
});
