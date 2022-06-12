// import type { EnhancedStore } from '@reduxjs/toolkit';
import Ajv from 'ajv';
import coreSchema from '@amnis/core/core.schema.json';
import type {
  ApiCrudProcesses,
  ApiCrudProcessesParams,
} from './crud.types';
import { apiOutput, apiValidate } from '../api';

const definitionsDefault = {
  create: 'core#/definitions/Insert',
  read: 'core#/definitions/Select',
  update: 'core#/definitions/Modify',
  delete: 'core#/definitions/Remove',
};

export function apiCrudProcesses(params: ApiCrudProcessesParams): ApiCrudProcesses {
  const {
    store,
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
    create: ajv.getSchema(defs.create),
    read: ajv.getSchema(defs.read),
    update: ajv.getSchema(defs.update),
    delete: ajv.getSchema(defs.delete),
  };

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
      const validateOutput = apiValidate(validator.create, body);
      if (validateOutput) {
        return validateOutput;
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
      const { body, jwt } = input;

      console.log('JWT:', jwt);

      /**
       * Validate the body.
       */
      const validateOutput = apiValidate(validator.read, body);
      if (validateOutput) {
        return validateOutput;
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
      const validateOutput = apiValidate(validator.update, body);
      if (validateOutput) {
        return validateOutput;
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
      const validateOutput = apiValidate(validator.delete, body);
      if (validateOutput) {
        return validateOutput;
      }

      const result = database.delete(body);

      output.json.result = result;

      return output;
    },

  };
}

export default apiCrudProcesses;
