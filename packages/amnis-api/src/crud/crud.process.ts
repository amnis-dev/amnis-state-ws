// import type { EnhancedStore } from '@reduxjs/toolkit';
import { coreActions } from '@amnis/core/actions';
import Ajv from 'ajv';
import { schemaSelect, schemaRemove } from '@amnis/core/schema';
import type { ApiError } from '../types';
import type {
  ApiCrudProcesses,
  ApiCrudProcessesParams,
} from './crud.types';
import { apiOutput } from '../api';

const ajv = new Ajv();

export function apiCrudProcesses(params: ApiCrudProcessesParams): ApiCrudProcesses {
  const { storeSetup, database } = params;
  const validatorCreate = ajv.compile(params.schemas.create);
  const validatorUpdate = ajv.compile(params.schemas.update);
  const validatorRead = ajv.compile(schemaSelect);
  const validatorDelete = ajv.compile(schemaRemove);

  return {
    /**
     * API handler for creating new data in storage.
     */
    create: (input) => {
      const localStore = storeSetup();
      const output = apiOutput();
      const { body } = input;

      /**
       * Validate the body.
       */
      validatorCreate(body);

      if (validatorCreate.errors !== undefined && validatorCreate.errors !== null) {
        output.json.errors = validatorCreate.errors.map<ApiError>((verror) => ({
          title: 'Validation Error',
          message: verror.message || '',
        }));
        return output;
      }

      /**
       * Dispatch action to the API store.
       */
      localStore.dispatch(coreActions.create(body));

      const result = database.create(localStore.getState());

      output.json.result = result;

      return output;
    },

    /**
     * API handler for reading data from storage.
     */
    read: (input) => {
      const output = apiOutput();
      const { body } = input;

      /**
       * Validate the body.
       */
      validatorRead(body);

      if (validatorRead.errors !== undefined && validatorRead.errors !== null) {
        output.json.errors = validatorRead.errors.map<ApiError>((verror) => ({
          title: 'Validation Error',
          message: verror.message || '',
        }));
        return output;
      }

      const result = database.read(body);

      output.json.result = result;

      return output;
    },

    /**
     * API handler for updating data in storage.
     */
    update: (input) => {
      const output = apiOutput();
      const localStore = storeSetup();
      const { body } = input;

      /**
       * Validate the body.
       */
      validatorUpdate(body);

      if (validatorUpdate.errors !== undefined && validatorUpdate.errors !== null) {
        output.json.errors = validatorUpdate.errors.map<ApiError>((verror) => ({
          title: 'Validation Error',
          message: verror.message || '',
        }));
        return output;
      }

      /**
       * Dispatch action to the API store.
       */
      localStore.dispatch(coreActions.update(body));

      const result = database.update(localStore.getState());

      output.json.result = result;

      return output;
    },

    /**
     * API handler for deleting data in storage. (Actually: only marks data as deleted)
     */
    delete: (input) => {
      const output = apiOutput();
      const { body } = input;

      /**
       * Validate the body.
       */
      validatorDelete(body);

      if (validatorDelete.errors !== undefined && validatorDelete.errors !== null) {
        output.json.errors = validatorDelete.errors.map<ApiError>((verror) => ({
          title: 'Validation Error',
          message: verror.message || '',
        }));
        return output;
      }

      const result = database.delete(body);

      output.json.result = result;

      return output;
    },

  };
}

export default apiCrudProcesses;
