/* eslint-disable @typescript-eslint/no-explicit-any */
import coreSchema from '@amnis/core/core.schema.json';
import { coreActions } from '@amnis/core/actions';

import { apiAuthProcess } from '@amnis/api/auth/auth.process';
import { apiCrudProcess } from '@amnis/api/crud/crud.process';
import { apiConfig } from '@amnis/api/config';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';
import { validatorsSetup } from '@amnis/api/validators';
import { apiIO } from '@amnis/api/api.io.node';
import authSchema from '@amnis/api/auth/auth.schema.json';

import { storeSetup } from '@amnis/state/env.node/store';

import stateSchema from '@amnis/state/state.schema.json';
import { memory } from '@amnis/db/memory';
import { serviceSetup } from './database';

/**
 * Create the server store.
 * The server store contains a cache of roles and tokens needed by the server.
 */
const serverStore = storeSetup();

/**
 * Configure the validation methods.
 */
const validators = validatorsSetup([coreSchema, authSchema, stateSchema]);

/**
 * Setup the server processes for the Auth operations
 */
const authHandlers = apiIO({
  store: serverStore,
  database: memory,
  validators,
}, apiAuthProcess);

/**
 * Setup the server processes for CRUD operations.
 */
const crudHanders = apiIO({
  store: serverStore,
  database: memory,
  validators,
}, apiCrudProcess);

/**
 * Mock the Auth API server for the tests.
 */
const mockAuthHandlers = apiMockGenerateHandlers(
  authHandlers,
  apiConfig.API_AUTH_URL,
);

/**
 * Mock the CRUD API server for the tests.
 */
const mockCrudHandlers = apiMockGenerateHandlers(
  crudHanders,
  apiConfig.API_CRUD_URL,
);

/**
  * Create a single mock service with the combined handlers.
  */
const mockServer = apiMockServer([...mockAuthHandlers, ...mockCrudHandlers]);

beforeAll(async () => {
  /**
   * Create the test database with pre-intantiated data.
   */
  const createResult = await serviceSetup(serverStore, memory);

  /**
    * Fetch roles from the database and populate the server store.
    */
  serverStore.dispatch(coreActions.create(createResult));
  mockServer.listen();
});
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => {
  mockServer.close();
});

/**
 * ============================================================
 */
test('service store should contain initial state slices', async () => {
  const serviceState = serverStore.getState();

  expect(serviceState).toEqual(
    expect.objectContaining({
      apiAuth: expect.any(Object),
      apiCrud: expect.any(Object),
      system: expect.any(Object),
      website: expect.any(Object),
      role: expect.any(Object),
      log: expect.any(Object),
    }),
  );
});
