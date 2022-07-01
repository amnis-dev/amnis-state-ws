/* eslint-disable @typescript-eslint/no-explicit-any */
import coreSchema from '@amnis/core/core.schema.json';

import { apiConfig } from '@amnis/api/config';
import { apiAuthProcesses } from '@amnis/api/auth/auth.process';
import { apiCrudProcesses } from '@amnis/api/crud/crud.process';
import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';

import stateSchema from '@amnis/state/state.schema.json';
import { memory } from '@amnis/db/memory';
import { Store } from '@reduxjs/toolkit';

/**
 * Function that prepares the api mock services.
 */
export function apiSetup(serverStore: Store) {
  /**
  * Setup the server processes for the Auth operations
  */
  const authHandlers = apiAuthProcesses({
    store: serverStore,
    database: memory,
  });

  /**
   * Setup the server processes for CRUD operations.
   */
  const crudHanders = apiCrudProcesses({
    store: serverStore,
    database: memory,
    schemas: [coreSchema, stateSchema],
    definitions: {
      create: 'state#/definitions/StateCreate',
      read: 'core#/definitions/Select',
      update: 'state#/definitions/StateUpdate',
      delete: 'core#/definitions/Remove',
    },
  });

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
