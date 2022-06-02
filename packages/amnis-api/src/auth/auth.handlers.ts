// import type { EnhancedStore } from '@reduxjs/toolkit';
import { coreActions } from '@amnis/core/actions';
import Ajv from 'ajv';
import type { ApiError, ApiHandlerSetupParams, ApiResponse } from '../types';
import type {
  ApiAuthHandlers,
} from './auth.types';

const ajv = new Ajv();

export function apiAuthHandlersSetup(params: ApiHandlerSetupParams): ApiAuthHandlers {
  const { storeSetup } = params;
  const database = params.databaseInterface;
  const validatorComplete = ajv.compile(params.schemaComplete);

  return {
    /**
     * API handler for creating new data in storage.
     */
    authorize: ({ body }): ApiResponse => ({
      errors: [],
      result: {},
    }),
  };
}

export default apiAuthHandlersSetup;
