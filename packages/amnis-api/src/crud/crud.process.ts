// import type { EnhancedStore } from '@reduxjs/toolkit';
import Ajv from 'ajv';
import coreSchema from '@amnis/core/core.schema.json';
import { selectors } from '@amnis/core/selectors';
import { authwall, authScopeCreate } from '@amnis/auth/index';
import { Task } from '@amnis/core/types';
import type {
  ApiCrudProcesses,
  ApiCrudProcessesParams,
} from './crud.types';
import { apiOutput, apiValidate } from '../api';

/**
 * Default schema definitions for validating the input.
 */
const definitionsDefault = {
  create: 'core#/definitions/Insert',
  read: 'core#/definitions/Select',
  update: 'core#/definitions/Modify',
  delete: 'core#/definitions/Remove',
};

/**
 * Sets up processes for CRUD operations. Processes require a JWT token for authorization.
 */
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

      if (!jwt) {
        output.status = 401; // 401 Unauthorized
        output.json.errors = [
          {
            title: 'Unauthorized',
            message: 'Access token is invalid.',
          },
        ];
        return output;
      }

      /**
       * Get array of grants from roles in the service store.
       */
      const grants = selectors.selectRoleGrants(store.getState(), jwt.roles);

      /**
       * Filter non-granted slices on the body (which is a State type).
       */
      const stateAuthwalled = authwall(body, grants, Task.Read);

      /**
       * finalized state to process
       */
      const stateFinal = jwt.adm === true ? body : stateAuthwalled;

      /**
       * Validate the body.
       */
      const validateOutput = apiValidate(validator.read, stateFinal);
      if (validateOutput) {
        return validateOutput;
      }

      /**
       * Create an authentication scope object from the array of grant objects.
       */
      const authScope = jwt.adm === true ? undefined : authScopeCreate(grants);

      const result = database.read(stateFinal, authScope, jwt.sub);

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
