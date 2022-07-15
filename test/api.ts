/* eslint-disable @typescript-eslint/no-explicit-any */
import coreSchema from '@amnis/core/core.schema.json';
import stateSchema from '@amnis/state/state.schema.json';
import authSchema from '@amnis/api/auth/auth.schema.json';

import { apiConfig } from '@amnis/api/config';
import { apiAuthProcesses } from '@amnis/api/auth/auth.process';
import { apiCrudProcesses } from '@amnis/api/crud/crud.process';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';

import { memory } from '@amnis/db/memory';
import { Store } from '@reduxjs/toolkit';
import { apiIO } from '@amnis/api/api.io.node';
import { validatorsSetup } from '@amnis/api/validators';

/**
 * Function that prepares the api mock services.
 */
export function apiSetup(serverStore: Store) {
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
  }, apiAuthProcesses);

  /**
   * Setup the server processes for CRUD operations.
   */
  const crudHanders = apiIO({
    store: serverStore,
    database: memory,
    validators,
  }, apiCrudProcesses);

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

  return mockServer;
}

export default apiSetup;
