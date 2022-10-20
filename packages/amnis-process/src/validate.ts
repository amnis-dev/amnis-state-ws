/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IoOutput, ioOutput, Validator, Validators,
} from '@amnis/core/index.js';
import type { AnySchema, AnyValidateFunction } from 'ajv/dist/types';
import Ajv from 'ajv';

/**
 * Common method of validating json that returns an errored output if invalid.
 * Returns an error output if failed.
 */
export function validate(
  validator: Validator | undefined,
  json: Record<string, any>,
): IoOutput | undefined {
  const ajvValidator = validator as AnyValidateFunction;
  if (!ajvValidator) {
    const output = ioOutput();
    output.status = 503; // 503 Service Unavailable
    output.json.logs.push({
      level: 'error',
      title: 'Validator Missing',
      description: 'The service cannot handle the request without validation.',
    });
    return output;
  }
  /**
   * Validate the body.
   */
  ajvValidator(json);

  if (ajvValidator.errors !== undefined && ajvValidator.errors !== null) {
    const output = ioOutput();
    output.status = 400; // 400 Bad Request

    ajvValidator.errors.forEach((verror) => {
      output.json.logs.push({
        level: 'error',
        title: 'Validation Failed',
        description: `${verror.instancePath} ${verror.message}` || 'The request is not valid.',
      });
    });
    return output;
  }

  return undefined;
}

function validateCompile(schema: AnySchema): Validators {
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
  const ajv = new Ajv({ schemas: [schema], code: { esm: true } });

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
export function validateSetup(schemas: AnySchema | AnySchema[]) {
  const validators: Validators = {};

  if (Array.isArray(schemas)) {
    schemas.forEach((schema) => {
      const validatorsNext = validateCompile(schema);
      Object.assign(validators, validatorsNext);
    });
  } else {
    const validatorsNext = validateCompile(schemas);
    Object.assign(validators, validatorsNext);
  }

  return validators;
}

export default validate;
