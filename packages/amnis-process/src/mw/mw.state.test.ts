/* eslint-disable no-bitwise */
import {
  databaseMemoryStorage,
  dateNumeric,
  Entity,
  entityCreate,
  Grant,
  GrantScope,
  grantTask,
  GrantTask,
  IoContext,
  IoInput,
  ioOutput,
  ioOutputErrored,
  IoProcess,
  JWTAccess,
  roleComboCreate,
  roleCreator,
  schemaEntity,
  StateCreator,
  StateDeleter,
  StateQuery,
  StateUpdater,
  System,
  UID,
  uid,
  User,
  userKey,
} from '@amnis/core';
import {
  contextSetup, roleActions, systemActions, systemSelectors,
} from '@amnis/state';
import { validateSetup } from '../validate.js';
import { mwState } from './mw.state.js';

let context: IoContext;

let userExisting: Entity<User>;

let accessAnon: JWTAccess;
let accessFull: JWTAccess;
let accessFullAdmin: JWTAccess;

type TestInputs = [
  IoInput<StateCreator>,
  IoInput<StateQuery>,
  IoInput<StateUpdater>,
  IoInput<StateDeleter>,
]

const testIteration = [
  GrantTask.Create,
  GrantTask.Read,
  GrantTask.Update,
  GrantTask.Delete,
];

const testInputs: TestInputs = [
  {
    body: {
      sliceA: [{ $id: uid('sliceA') }],
      sliceB: [{ $id: uid('sliceB') }],
      sliceC: [{ $id: uid('sliceC') }],
    },
  },
  {
    body: {
      sliceA: {},
      sliceB: {},
      sliceC: {},
    },
  },
  {
    body: {
      sliceA: [{ $id: uid('sliceA') }],
      sliceB: [{ $id: uid('sliceB') }],
      sliceC: [{ $id: uid('sliceC') }],
    },
  },
  {
    body: {
      sliceA: [],
      sliceB: [],
      sliceC: [],
    },
  },
];

let testUserInputs: TestInputs;

/**
 * Create an empty process for the middleware.
 */
const noprocess: IoProcess = () => async (i, o) => o;

/**
 * Setup the test environment...
 */
beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaEntity]),
  });

  const system = systemSelectors.selectActive(context.store.getState()) as Entity<System>;

  const storage = databaseMemoryStorage();
  const usersStored = Object.values(storage[userKey]) as Entity<User>[];
  userExisting = usersStored.find((u) => u.handle === 'user') as Entity<User>;
  const adminUser = usersStored.find((u) => u.handle === 'admin') as Entity<User>;

  /**
   * Anonymous role is set to only allow READS and UPDATES on "sliceC".
   */
  const grantsAnon: Grant[] = [
    ['sliceC', GrantScope.Global, grantTask(0, 1, 1, 0)],
  ];
  const roleAnon = entityCreate(roleCreator({
    name: 'Anon Access Role',
    grants: grantsAnon,
  }));
  context.store.dispatch(roleActions.insert(roleAnon));
  context.store.dispatch(systemActions.update({
    $id: system.$id,
    $anonymousRole: roleAnon.$id,
  }));

  /**
   * Setup grants that provide full access.
   */
  const grantsFull: Grant[] = [
    ['user', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['sliceA', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['sliceB', GrantScope.Global, grantTask(1, 1, 1, 1)],
    ['sliceC', GrantScope.Global, grantTask(1, 1, 1, 1)],
  ];
  const roleFull = roleCreator({
    name: 'Full Access Role',
    grants: grantsFull,
  });
  const comboFull = roleComboCreate([roleFull]);

  context.store.dispatch(roleActions.insertCombo(comboFull));

  /**
   * Define the access varieties to test with.
   * Only the "sub" and "pem" values matter.
   */
  accessAnon = {
    iss: '',
    sub: 'user:anonymous' as UID,
    exp: dateNumeric('30m'),
    typ: 'access',
    roles: [],
    /**
     * No pem value here. The middleware will set the Anonymous role grants.
     */
  };
  accessFull = {
    iss: '',
    sub: 'user:full' as UID,
    exp: dateNumeric('30m'),
    typ: 'access',
    roles: [],
    pem: comboFull[0],
  };
  accessFullAdmin = {
    iss: '',
    sub: adminUser.$id,
    exp: dateNumeric('30m'),
    typ: 'access',
    roles: [],
    pem: comboFull[0],
  };

  testUserInputs = [
    {
      body: {
        ...testInputs[0].body,
        user: [{ $id: userExisting.$id }],
      },
    },
    {
      body: {
        ...testInputs[1].body,
        user: {},
      },
    },
    {
      body: {
        ...testInputs[2].body,
        user: [{ $id: userExisting.$id }],
      },
    },
    {
      body: {
        ...testInputs[3].body,
        user: [userExisting.$id],
      },
    },
  ];
});

/**
 * ================================================================================================
 * ************************************************************************************************
 * STATE TESTS
 * ************************************************************************************************
 * ================================================================================================
 */
test('should pass through the state middleware successfully', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      /**
       * Ensure nothing was filtered on the input body.
       */
      expect(Object.keys(input.body)).toEqual(Object.keys(testInputs[index].body));

      /**
       * Set the output result so the middleware can add successful logs.
       */
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testInputs[index],
        access: accessFull,
      },
      ioOutput(),
    );

    expect(output.status).toBe(200);
    expect(ioOutputErrored(output)).toBe(false);
    expect(output.json.logs).toHaveLength(1);
    expect(output.json.logs[0].level).toBe('success');
  }));
});

/**
 * ================================================================================================
 */
test('should pass through the state middleware successfully with creating a user as admin', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      /**
       * Ensure nothing was filtered on the input body.
       */
      expect(Object.keys(input.body).sort()).toEqual(
        Object.keys(testUserInputs[index].body).sort(),
      );

      /**
       * Set the output result so the middleware can add successful logs.
       */
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testUserInputs[index],
        access: accessFullAdmin,
      },
      ioOutput(),
    );

    expect(output.status).toBe(200);
    expect(ioOutputErrored(output)).toBe(false);
    expect(output.json.logs).toHaveLength(1);
    expect(output.json.logs[0].level).toBe('success');
  }));
});

/**
 * ================================================================================================
 */
test('should fail through the state create middleware with creating a user', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      expect(Object.keys(input.body).sort()).toEqual(
        Object.keys(testUserInputs[index].body).sort(),
      );
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testUserInputs[index],
        access: accessFull,
      },
      ioOutput(),
    );

    if (task & (GrantTask.Create | GrantTask.Update | GrantTask.Delete)) {
      expect(output.status).toBe(401);
      expect(ioOutputErrored(output)).toBe(true);
      expect(output.json.logs).toHaveLength(1);
      expect(output.json.logs[0].level).toBe('error');
    }
    /**
     * Admin role is not needed for reading user data.
     */
    if (task & (GrantTask.Read)) {
      expect(output.status).toBe(200);
      expect(ioOutputErrored(output)).toBe(false);
      expect(output.json.logs).toHaveLength(1);
      expect(output.json.logs[0].level).toBe('success');
    }
  }));
});

/**
 * ================================================================================================
 */
test('should fail through the state create middleware as anonymous', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(() => async (input, output) => {
      /**
       * All slices should have been filtered on CREATE and DELETE.
       */
      if (task & (GrantTask.Create | GrantTask.Delete)) {
        expect(Object.keys(input.body)).toEqual([]);
      }
      /**
       * Remember, we allowed anonymous to READ and UPDATE "sliceC"
       */
      if (task & (GrantTask.Read | GrantTask.Update)) {
        expect(Object.keys(input.body)).toEqual(['sliceC']);
      }
      output.json.result = input.body;

      return output;
    });

    const output = await process(context)(
      {
        ...testInputs[index],
        access: accessAnon,
      },
      ioOutput(),
    );

    /**
     * The status should still be 200 even though everything was filtered off the state.
     */
    expect(output.status).toBe(200);
    expect(ioOutputErrored(output)).toBe(true);

    if (task & (GrantTask.Create | GrantTask.Delete)) {
      expect(output.json.logs).toHaveLength(1);
      expect(output.json.logs[0].level).toBe('error');
    }
    if (task & (GrantTask.Read | GrantTask.Update)) {
      expect(output.json.logs).toHaveLength(2);
      const logLevels = output.json.logs.map((l) => l.level);
      expect(logLevels.includes('error')).toBe(true);
      expect(logLevels.includes('success')).toBe(true);
    }
  }));
});

/**
 * ================================================================================================
 */
test('should fail through the state create middleware with no access', async () => {
  await Promise.all(testIteration.map(async (task, index) => {
    const process = mwState(task)(noprocess);

    const output = await process(context)(
      {
        ...testInputs[index],
      },
      ioOutput(),
    );

    /**
     * Unauthorized status since no access object was set.
     */
    expect(output.status).toBe(401);
    expect(ioOutputErrored(output)).toBe(true);
    expect(output.json.logs).toHaveLength(1);
    expect(output.json.logs[0].level).toBe('error');
  }));
});
