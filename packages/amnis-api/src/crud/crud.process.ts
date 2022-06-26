/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { EnhancedStore } from '@reduxjs/toolkit';
import Ajv from 'ajv';
import coreSchema from '@amnis/core/core.schema.json';
import type {
  ApiCrudProcesses,
  ApiCrudProcessesParams,
} from './crud.types';
import { crudProcessCreate } from './crud.process.create';
import { crudProcessRead } from './crud.process.read';
import { crudProcessUpdate } from './crud.process.update';
import { crudProcessDelete } from './crud.process.delete';
import { mwJwt } from '../mw.jwt';
import { mwValidate } from '../mw.validate';

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

  return {
    create: mwJwt(mwValidate(crudProcessCreate))({
      store,
      database,
      validator: ajv.getSchema(defs.create),
    }),

    read: mwJwt(mwValidate(crudProcessRead))({
      store,
      database,
      validator: ajv.getSchema(defs.read),
    }),

    update: mwJwt(mwValidate(crudProcessUpdate))({
      store,
      database,
      validator: ajv.getSchema(defs.update),
    }),

    delete: mwJwt(mwValidate(crudProcessDelete))({
      store,
      database,
      validator: ajv.getSchema(defs.delete),
    }),

  };
}

export default apiCrudProcesses;
