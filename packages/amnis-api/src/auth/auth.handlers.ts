// import type { EnhancedStore } from '@reduxjs/toolkit';
import { coreActions } from '@amnis/core/actions';
import Ajv from 'ajv';
import { schemaSelect, schemaRemove } from '@amnis/core/schema';
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
    authorize: ({ body }): ApiResponse => {
      const localStore = storeSetup();
      const errors: ApiError[] = [];

      /**
       * Validate the body.
       */
      validatorComplete(body);

      if (validatorComplete.errors !== undefined && validatorComplete.errors !== null) {
        return {
          errors: validatorComplete.errors.map<ApiError>((verror) => ({
            title: 'Validation Error',
            message: verror.message || '',
          })),
          result: {},
        };
      }

      /**
       * Dispatch action to the API store.
       */
      localStore.dispatch(coreActions.create(body));

      const result = database.create(localStore.getState());

      return {
        errors,
        result,
      };
    },
}

export default apiAuthHandlersSetup;
