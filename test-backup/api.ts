/* eslint-disable @typescript-eslint/no-explicit-any */
import coreSchema from '@amnis/core/core.schema.json';
import stateSchema from '@amnis/state/state.schema.json';
import schemaAuth from '@amnis/api/auth/auth.schema.json';

import { apiConfig } from '@amnis/api/config.js';
import { apiAuthProcess } from '@amnis/api/auth/auth.process.js';
import { apiCrudProcess } from '@amnis/api/crud/crud.process.js';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock.js';

import { memory } from '@amnis/db';
import type { Store } from '@reduxjs/toolkit';
import { apiIO } from '@amnis/api';
import { validatorsSetup } from '@amnis/api/validators.js';

/**
 * Function that prepares the api mock services.
 */
export function apiSetup(serverStore: Store) {
  /**
   * Configure the validation methods.
   */
  const validators = validatorsSetup([coreSchema, schemaAuth, stateSchema]);

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

  return mockServer;
}

export default apiSetup;
