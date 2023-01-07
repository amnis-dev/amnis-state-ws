import { apiActions, apiAuth } from '@amnis/api';
import {
  accountsGet,
  agentCredential,
  credentialKey,
  databaseMemoryStorage,
  Entity,
  sendMailboxStorage,
  User,
  userKey,
} from '@amnis/core';
import {
  credentialSelectors, otpActions, userSelectors,
} from '@amnis/state';
import { clientStore } from './common/client.store.js';
import { mockService } from './mock.service.js';

const baseUrl = 'https://amnis.dev';

clientStore.dispatch(apiActions.upsertMany([
  { id: 'apiAuth', baseUrl: `${baseUrl}/api/auth` },
  { id: 'apiCrud', baseUrl: `${baseUrl}/api/crud` },
]));

let adminUser: Entity<User>;

beforeAll(async () => {
  await mockService.setup({ baseUrl });
  mockService.start();

  const storage = databaseMemoryStorage();
  const storageUsers = Object.values(storage[userKey]) as Entity<User>[];

  adminUser = storageUsers.find((u) => u.handle === 'admin') as Entity<User>;
});

afterAll(() => {
  mockService.stop();
});

test('should NOT login as an administrator without matching credentials', async () => {
  const { admin } = await accountsGet();

  /**
   * Login
   */
  const response = await clientStore.dispatch(apiAuth.endpoints.login.initiate({
    handle: admin.handle,
    password: admin.password,
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data: { logs, result } } = response;

  expect(result).toBeUndefined();
  expect(logs[0].title).toBe('Unknown Agent');
});

test('should add the current agent credential to the admin account and login', async () => {
  const { admin } = await accountsGet();
  const credentialAgent = await agentCredential();

  /**
   * Need to start with obtaining a one-time password
   */
  const responseOtp = await clientStore.dispatch(apiAuth.endpoints.otp.initiate({
    $subject: `@${admin.handle}`,
    email: adminUser.email,
  }));

  if ('error' in responseOtp) {
    expect(responseOtp.error).toBeUndefined();
    return;
  }

  const { data: { result: otpResult } } = responseOtp;

  if (!otpResult) {
    expect(otpResult).toBeDefined();
    return;
  }

  /**
   * Get the OTP value from the memory mailbox.
   */
  const mailbox = sendMailboxStorage();
  const message = mailbox[adminUser.email as string][0];
  const messageOtp = message.text.match(/"([A-Za-z0-9]+)"/)?.[1];

  if (!messageOtp) {
    expect(messageOtp).toBeDefined();
    return;
  }

  /**
   * Set the OTP value.
   */
  clientStore.dispatch(otpActions.set(messageOtp));

  /**
   * With the latest OTP stored and value set in the clientStore,
   * attempt to add the new credential using the admin password.
   */
  const response = await clientStore.dispatch(apiAuth.endpoints.credential.initiate({
    password: admin.password,
  }));

  if ('error' in response) {
    expect(response.error).toBeUndefined();
    return;
  }

  const { data: { result } } = response;

  if (!result) {
    expect(response).toBeDefined();
    return;
  }

  /**
   * Test the client store to ensure data is updated properly
   */
  const credential = credentialSelectors.selectById(
    clientStore.getState(),
    result[credentialKey][0].$id,
  );
  const user = userSelectors.selectById(
    clientStore.getState(),
    result[userKey][0].$id,
  );

  if (!credential || !user) {
    expect(credential).toBeDefined();
    expect(user).toBeDefined();
    return;
  }

  expect(credential).toEqual(result[credentialKey][0]);
  expect(credential.$id).toBe(credentialAgent.$id);
  expect(credential).toMatchObject(credentialAgent);
  expect(user).toEqual(result[userKey][0]);
  expect(user.$credentials.includes(credential.$id)).toBe(true);
});
