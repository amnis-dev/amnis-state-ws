import { deviceStringify } from '../device';
import { userKey, userCreate } from './user';

/**
 * ============================================================
 */
test('user key should be is properly set', () => {
  expect(userKey).toEqual('user');
});

/**
 * ============================================================
 */
test('should create a user', () => {
  const [user, logs] = userCreate({
    name: 'Newbie',
    password: 'passwd0',
    email: 'newbie@amnis.dev',
    devices: [deviceStringify({
      ip: '176.46.95.196',
      system: 'Windows',
    })],
  });

  expect(user).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      password: expect.any(String),
      email: expect.any(String),
      devices: expect.any(Array),
    }),
  );

  expect(logs).toHaveLength(0);
});

/**
 * ============================================================
 */
test('should log invaid name', () => {
  const [user, logs] = userCreate({
    name: 'New_bie#%21*',
    password: 'passwd0',
    email: 'newbie@amnis.dev',
    devices: [deviceStringify({
      ip: '176.46.95.196',
      system: 'Windows',
    })],
  });

  expect(user).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      password: expect.any(String),
      email: expect.any(String),
      devices: expect.any(Array),
    }),
  );

  expect(logs).toHaveLength(1);

  expect(logs[0]).toEqual(
    expect.objectContaining({
      level: 'error',
      title: 'Invalid Username',
    }),
  );
});

/**
 * ============================================================
 */
test('should log invaid email', () => {
  const [user, logs] = userCreate({
    name: 'Newbie',
    password: 'passwd0',
    email: 'newbieamnisdev',
    devices: [deviceStringify({
      ip: '176.46.95.196',
      system: 'Windows',
    })],
  });

  expect(user).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      password: expect.any(String),
      email: expect.any(String),
      devices: expect.any(Array),
    }),
  );

  expect(logs).toHaveLength(1);

  expect(logs[0]).toEqual(
    expect.objectContaining({
      level: 'error',
      title: 'Invalid User Email',
    }),
  );
});

/**
 * ============================================================
 */
test('should log invaid device', () => {
  const [user, logs] = userCreate({
    name: 'Newbie',
    password: 'passwd0',
    email: 'newbie@amnis.dev',
    devices: [deviceStringify({
      ip: '012.34.56.789',
      system: 'Someother',
    })],
  });

  expect(user).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      password: expect.any(String),
      email: expect.any(String),
      devices: expect.any(Array),
    }),
  );

  expect(logs).toHaveLength(1);

  expect(logs[0]).toEqual(
    expect.objectContaining({
      level: 'error',
      title: 'Invalid Device',
    }),
  );
});
