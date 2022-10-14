/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyValidateFunction } from 'ajv/dist/types';
import type { ApiOutput } from './types';

export function apiOutput<T = any>(): ApiOutput<T> {
  return {
    status: 200, // 200 OK
    cookies: {},
    json: {
      logs: [],
      result: undefined,
      expire: undefined,
    },
  };
}

/**
 * Common method of validating json that returns an errored output if invalid.
 * Returns an error output if failed.
 */
export function apiValidate(
  validator: AnyValidateFunction | undefined,
  json: Record<string, any>,
): ApiOutput | undefined {
  if (!validator) {
    const output = apiOutput();
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
  validator(json);

  if (validator.errors !== undefined && validator.errors !== null) {
    const output = apiOutput();
    output.status = 400; // 400 Bad Request

    validator.errors.forEach((verror) => {
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

export default { apiOutput };
