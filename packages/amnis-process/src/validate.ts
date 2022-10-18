/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoOutput, ioOutput, Validator } from '@amnis/core/index.js';
import type { AnyValidateFunction } from 'ajv/dist/types';

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

export default validate;
