/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { EnhancedStore } from '@reduxjs/toolkit';
import Ajv from 'ajv';
import coreSchema from '@amnis/core/core.schema.json';
import { selectors } from '@amnis/core/selectors';
import { authwall } from '@amnis/auth/authwall';
import { authScopeCreate } from '@amnis/auth/scope';
import { State, Task } from '@amnis/core/types';
import { entityClean, entityCreate } from '@amnis/core/core';
import { coreActions } from '@amnis/core/actions';
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
     * ================================================================================
     * CREATE
     * API handler for creating new data in storage.
     * ----------------------------------------
     */
    create: async (input) => {
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
      const stateAuthwalled = authwall(body, grants, Task.Create);

      /**
       * Clean entity properties that should not be updated.
       */
      let entityIssue = false;
      const stateUpdateSanatizd = Object.keys(stateAuthwalled).reduce<State>((state, key) => {
        state[key] = stateAuthwalled[key].map(
          (entity: any) => {
            const cleaned = entityClean(key, entity);
            if (cleaned) {
              return entityCreate(
                key,
                cleaned,
                { $owner: jwt.sub },
              );
            }
            entityIssue = true;
            return undefined;
          },
        ).filter((entity: any) => entity !== undefined);
        return state;
      }, {});

      if (entityIssue) {
        output.status = 401; // 401 Unauthorized
        output.json.errors = [
          {
            title: 'Invalid Identifier',
            message: 'There was an invalid identity key used.',
          },
        ];
        return output;
      }

      /**
       * finalized state to process
       */
      const stateFinal = jwt.adm === true ? body : stateUpdateSanatizd;

      /**
       * Validate the body.
       */
      const validateOutput = apiValidate(validator.create, stateFinal);
      if (validateOutput) {
        return validateOutput;
      }

      const result = await database.create(stateFinal);

      /**
       * Add errors for denied keys.
       */
      const deniedKeys = Object.keys(body).map((sliceKey) => {
        if (typeof result[sliceKey] !== 'object' || Object.keys(result[sliceKey]).length < 1) {
          return sliceKey;
        }
        return null;
      }).filter((value) => value !== null);

      if (deniedKeys.length) {
        output.json.errors.push({
          title: 'Creations Disallowed',
          message: `Missing permissions to create documents in the collections: ${deniedKeys.join(', ')}`,
        });
      }

      output.json.result = result;

      /**
       * Update the server store with the creation of the entity.
       */
      store.dispatch(coreActions.create(result));

      return output;
    },

    /**
     * ================================================================================
     * READ
     * API handler for reading data from storage.
     * ----------------------------------------
     */
    read: async (input) => {
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
      const authScope = jwt.adm === true ? undefined : authScopeCreate(grants, Task.Read);

      const result = await database.read(stateFinal, authScope, jwt.sub);

      /**
       * Add errors for denied keys.
       */
      const deniedKeys = Object.keys(body).map((sliceKey) => {
        if (typeof result[sliceKey] !== 'object') {
          return sliceKey;
        }
        return null;
      }).filter((value) => value !== null);

      if (deniedKeys.length) {
        output.json.errors.push({
          title: 'Readings Disallowed',
          message: `Missing permissions to read from the collections: ${deniedKeys.join(', ')}`,
        });
      }

      output.json.result = result;

      return output;
    },

    /**
     * ================================================================================
     * UPDATE
     * API handler for updating data in storage.
     * ----------------------------------------
     */
    update: async (input) => {
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
      const stateAuthwalled = authwall(body, grants, Task.Update);

      /**
       * Clean entity properties that should not be updated.
       */
      const stateUpdateSanatizd = Object.keys(stateAuthwalled).reduce<State>((state, key) => {
        state[key] = stateAuthwalled[key].map(
          (entity: any) => entityClean(key, entity),
        ).filter((entity: any) => entity !== undefined);
        return state;
      }, {});

      /**
       * finalized state to process
       */
      const stateFinal = jwt.adm === true ? body : stateUpdateSanatizd;

      /**
       * Validate the body.
       */
      const validateOutput = apiValidate(validator.update, stateFinal);
      if (validateOutput) {
        return validateOutput;
      }

      /**
       * Create an authentication scope object from the array of grant objects.
       */
      const authScope = jwt.adm === true ? undefined : authScopeCreate(grants, Task.Update);

      const result = await database.update(stateFinal, authScope, jwt.sub);

      /**
       * Add errors for denied keys.
       */
      const deniedKeys = Object.keys(body).map((sliceKey) => {
        if (typeof result[sliceKey] !== 'object' || Object.keys(result[sliceKey]).length < 1) {
          return sliceKey;
        }
        return null;
      }).filter((value) => value !== null);

      if (deniedKeys.length) {
        output.json.errors.push({
          title: 'Updates Disallowed',
          message: `Missing permissions to update the collections: ${deniedKeys.join(', ')}`,
        });
      }

      output.json.result = result;

      /**
       * Update the server store with possible changes.
       */
      store.dispatch(coreActions.update(result));

      return output;
    },

    /**
     * ================================================================================
     * DELETE
     * API handler for deleting data in storage. (Actually: only marks data as deleted)
     * ----------------------------------------
     */
    delete: async (input) => {
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
      const stateAuthwalled = authwall(body, grants, Task.Delete);

      /**
       * finalized state to process
       */
      const stateFinal = jwt.adm === true ? body : stateAuthwalled;

      /**
       * Validate the body.
       */
      const validateOutput = apiValidate(validator.delete, stateFinal);
      if (validateOutput) {
        return validateOutput;
      }

      /**
       * Create an authentication scope object from the array of grant objects.
       */
      const authScope = jwt.adm === true ? undefined : authScopeCreate(grants, Task.Update);

      const result = await database.delete(stateFinal, authScope, jwt.sub);

      /**
       * Add errors for denied keys.
       */
      const deniedKeys = Object.keys(body).map((sliceKey) => {
        if (typeof result[sliceKey] !== 'object' || Object.keys(result[sliceKey]).length < 1) {
          return sliceKey;
        }
        return null;
      }).filter((value) => value !== null);

      if (deniedKeys.length) {
        output.json.errors.push({
          title: 'Deletes Disallowed',
          message: `Missing permissions to delete from the collections: ${deniedKeys.join(', ')}`,
        });
      }

      output.json.result = result;

      /**
       * Remove possible entities from the server store.
       */
      store.dispatch(coreActions.delete(result));

      return output;
    },

  };
}

export default apiCrudProcesses;
