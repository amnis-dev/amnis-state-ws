// import type { EnhancedStore } from '@reduxjs/toolkit';
import Ajv from 'ajv';
import type { AnyValidateFunction } from 'ajv/dist/types';
import coreSchema from '@amnis/core/core.schema.json';
import type { ApiError } from '../types';
import type {
  ApiCrudProcesses,
  ApiCrudProcessesParams,
} from './crud.types';
import { apiOutput } from '../api';

const definitionsDefault = {
  create: 'core#/definitions/Insert',
  read: 'core#/definitions/Select',
  update: 'core#/definitions/Modify',
  delete: 'core#/definitions/Remove',
};

export function apiCrudProcesses(params: ApiCrudProcessesParams): ApiCrudProcesses {
  const {
    database,
    schemas,
    definitions,
  } = params;
  const ajv = new Ajv({ schemas: schemas ?? [coreSchema] });

  const defs = {
    ...definitionsDefault,
    ...definitions,
  };

  const validator = {
    create: ajv.getSchema(defs.create) as AnyValidateFunction<unknown>,
    read: ajv.getSchema(defs.read) as AnyValidateFunction<unknown>,
    update: ajv.getSchema(defs.update) as AnyValidateFunction<unknown>,
    delete: ajv.getSchema(defs.delete) as AnyValidateFunction<unknown>,
  };

  Object.keys(validator).forEach((key) => {
    const vkey = key as keyof typeof validator;
    if (validator[vkey] === undefined) {
      throw new Error(`Schema definition for '${key}' not found.`);
    }
  });

  return {
    /**
     * API handler for creating new data in storage.
     */
    create: (input) => {
      const output = apiOutput();
      const { body } = input;
      /**
       * Validate the body.
       */
      validator.create(body);

      if (validator.create.errors !== undefined && validator.create.errors !== null) {
        output.json.errors = validator.create.errors.map<ApiError>((verror) => ({
          title: 'Validation Error',
          message: verror.message || '',
        }));
        return output;
      }

      const result = database.create(body);

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
      validator.read(body);

      if (validator.read.errors !== undefined && validator.read.errors !== null) {
        output.json.errors = validator.read.errors.map<ApiError>((verror) => ({
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
      const { body } = input;

      /**
       * Validate the body.
       */
      validator.update(body);

      if (validator.update.errors !== undefined && validator.update.errors !== null) {
        output.json.errors = validator.update.errors.map<ApiError>((verror) => ({
          title: 'Validation Error',
          message: verror.message || '',
        }));
        return output;
      }

      const result = database.update(body);

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
      validator.delete(body);

      if (validator.delete.errors !== undefined && validator.delete.errors !== null) {
        output.json.errors = validator.delete.errors.map<ApiError>((verror) => ({
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
