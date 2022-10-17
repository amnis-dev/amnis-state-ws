/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AnySchema, AnyValidateFunction } from 'ajv/dist/types';
import Ajv from 'ajv';

import type { Validators } from './types.js';

function compileValidators(schema: AnySchema): Validators {
  if (typeof schema === 'boolean') {
    throw new Error('Cannot create validators from a boolean schema');
  }

  const id = schema?.$id;
  if (!id) {
    throw new Error('Schema must have an $id.');
  }

  const definitions = schema?.definitions;

  if (!definitions) {
    throw new Error(`Schema, with id of ${id}, must have definitions to create validators from.`);
  }
  const validatorKeys = Object.keys(definitions);

  /** @ts-ignore */
  const ajv = new Ajv({ schemas: [schema] });

  const validators = validatorKeys.reduce<Validators>(
    (record, key) => {
      record[key] = ajv.getSchema(`${id}#/definitions/${key}`) as AnyValidateFunction;
      return record;
    },
    {},
  );

  return validators;
}

/**
 * Configures validators from one or more schemas. The validators are created from the definitions
 * object within each schema.
 */
export function validatorsSetup(schemas: AnySchema | AnySchema[]) {
  const validators: Validators = {};

  if (Array.isArray(schemas)) {
    schemas.forEach((schema) => {
      const validatorsNext = compileValidators(schema);
      Object.assign(validators, validatorsNext);
    });
  } else {
    const validatorsNext = compileValidators(schemas);
    Object.assign(validators, validatorsNext);
  }

  return validators;
}

export default { validatorsSetup };
