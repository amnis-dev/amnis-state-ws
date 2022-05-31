// import type { EnhancedStore } from '@reduxjs/toolkit';
import { coreActions } from '@amnis/core/actions';
import type {
  ResultCreate, ResultRead, ResultUpdate, ResultDelete,
} from '@amnis/core/types';
import Ajv from 'ajv';
import type { ApiError, ApiHandlerGeneratorParams, ApiResponse } from '../types';
import type {
  ApiCrudHandlers,
} from './crud.types';

const ajv = new Ajv();

export function apiCrudHandlersGenerate(params: ApiHandlerGeneratorParams): ApiCrudHandlers {
  const storeGenerate = params.storeGenerator;
  const database = params.databaseInterface;
  const validatorComplete = ajv.compile(params.schemaComplete);
  const validatorPartial = ajv.compile(params.schemaPartial);

  return {
    /**
     * API handler for creating new data in storage.
     */
    create: ({ body }): ApiResponse<ResultCreate> => {
      const store = storeGenerate();
      const errors: ApiError[] = [];

      /**
       * Validate the body as an array of entities.
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
      store.dispatch(coreActions.create(body));

      const result = database.create(store.getState());

      return {
        errors,
        result,
      };
    },

    /**
     * API handler for reading data from storage.
     */
    read: ({ body }): ApiResponse<ResultRead> => {
      const store = storeGenerate();
      const errors: ApiError[] = [];

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
      const store = storeGenerate();
      const errors: ApiError[] = [];

      /**
       * Dispatch action to the API store.
       */
      store.dispatch(coreActions.update(body));

      const result = database.update(store.getState());

      return {
        errors,
        result,
      };
    },

    /**
     * API handler for deleting data in storage. (Actually: only marks data as deleted)
     */
    delete: ({ body }): ApiResponse<ResultDelete> => {
      const store = storeGenerate();
      const errors: ApiError[] = [];

      const result = database.delete(body);

      return {
        errors,
        result,
      };
    },

  };
}

export default apiCrudHandlersGenerate;
