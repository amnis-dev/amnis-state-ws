// import type { EnhancedStore } from '@reduxjs/toolkit';
import { coreActions } from '@amnis/core/actions';
import type {
  ResultCreate, ResultRead, ResultUpdate, ResultDelete,
} from '@amnis/core/types';
import Ajv from 'ajv';
import { schemaSelect, schemaRemove } from '@amnis/core/schema';
import type { ApiError, ApiHandlerSetupParams, ApiResponse } from '../types';
import type {
  ApiCrudHandlers,
} from './msgraph.types';

const ajv = new Ajv();

export function apiCrudHandlersSetup(params: ApiHandlerSetupParams): ApiCrudHandlers {
  const { storeSetup } = params;
  const database = params.databaseInterface;
  const validatorComplete = ajv.compile(params.schemaComplete);
  const validatorPartial = ajv.compile(params.schemaPartial);
  const validatorSelect = ajv.compile(schemaSelect);
  const validatorRemove = ajv.compile(schemaRemove);

  return {
    /**
     * API handler for creating new data in storage.
     */
    create: ({ body }): ApiResponse<ResultCreate> => {
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

    /**
     * API handler for reading data from storage.
     */
    read: ({ body }): ApiResponse<ResultRead> => {
      const errors: ApiError[] = [];

      /**
       * Validate the body.
       */
      validatorSelect(body);

      if (validatorSelect.errors !== undefined && validatorSelect.errors !== null) {
        return {
          errors: validatorSelect.errors.map<ApiError>((verror) => ({
            title: 'Validation Error',
            message: verror.message || '',
          })),
          result: {},
        };
      }

      const result = database.read(body);

      return {
        errors,
        result,
      };
    },

    /**
     * API handler for updating data in storage.
     */
    update: ({ body }): ApiResponse<ResultUpdate> => {
      const localStore = storeSetup();
      const errors: ApiError[] = [];

      /**
       * Validate the body.
       */
      validatorPartial(body);

      if (validatorPartial.errors !== undefined && validatorPartial.errors !== null) {
        return {
          errors: validatorPartial.errors.map<ApiError>((verror) => ({
            title: 'Validation Error',
            message: verror.message || '',
          })),
          result: {},
        };
      }

      /**
       * Dispatch action to the API store.
       */
      localStore.dispatch(coreActions.update(body));

      const result = database.update(localStore.getState());

      return {
        errors,
        result,
      };
    },

    /**
     * API handler for deleting data in storage. (Actually: only marks data as deleted)
     */
    delete: ({ body }): ApiResponse<ResultDelete> => {
      const errors: ApiError[] = [];

      /**
       * Validate the body.
       */
      validatorRemove(body);

      if (validatorRemove.errors !== undefined && validatorRemove.errors !== null) {
        return {
          errors: validatorRemove.errors.map<ApiError>((verror) => ({
            title: 'Validation Error',
            message: verror.message || '',
          })),
          result: {},
        };
      }

      const result = database.delete(body);

      return {
        errors,
        result,
      };
    },

  };
}

export default apiCrudHandlersSetup;
