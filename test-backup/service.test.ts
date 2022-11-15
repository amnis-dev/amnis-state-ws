/* eslint-disable @typescript-eslint/no-explicit-any */
import coreSchema from '@amnis/core/core.schema.json';
import { coreActions } from '@amnis/core/actions.js';

import { apiAuthProcess } from '@amnis/api/auth/auth.process.js';
import { apiCrudProcess } from '@amnis/api/crud/crud.process.js';
import { apiConfig } from '@amnis/api/config.js';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock.js';
import { validatorsSetup } from '@amnis/api/validators.js';
import { apiIO } from '@amnis/api/api.io.node.js';
import schemaAuth from '@amnis/api/auth/auth.schema.json';

import { storeSetup } from '@amnis/state/env.node/store.js';

import stateSchema from '@amnis/state/state.schema.json';
import { dbmemory } from '@amnis/db/memory/index.js';
import { serviceSetup } from './database.js';

/**
 * Create the server store.
 * The server store contains a cache of roles and bearers needed by the server.
 */
const serverStore = storeSetup();

/**
 * Configure the validation methods.
 */
const validators = validatorsSetup([coreSchema, schemaAuth, stateSchema]);

/**
 * Setup the server processes for the Auth operations
 */
const authHandlers = apiIO({
  store: serverStore,
  database: dbmemory,
  validators,
}, apiAuthProcess);

/**
 * Setup the server processes for CRUD operations.
 */
const crudHanders = apiIO({
  store: serverStore,
  database: dbmemory,
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
