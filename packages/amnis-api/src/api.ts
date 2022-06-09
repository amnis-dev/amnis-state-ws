/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyValidateFunction } from 'ajv/dist/types';
import type { ApiOutput, ApiError } from './types';

export function apiOutput(): ApiOutput {
  return {
    status: 200, // 200 OK
    cookies: {},
    json: {
      errors: [],
      result: undefined,
      expire: undefined,
    },
  };
}

/**
 * Common method of validating json that returns an errored output if invalid.
 */
export function apiValidate(
  validator: AnyValidateFunction | undefined,
  json: Record<string, any>,
): ApiOutput | undefined {
  if (!validator) {
    const output = apiOutput();
    output.status = 503; // 503 Service Unavailable
    output.json.errors = [{
      title: 'Validator Missing',
      message: 'The service cannot handle the request without validation.',
    }];
    return output;
  }
  /**
   * Validate the body.
   */
  validator(json);

  if (validator.errors !== undefined && validator.errors !== null) {
    const output = apiOutput();
    output.status = 400; // 400 Bad Request
    output.json.errors = validator.errors.map<ApiError>((verror) => ({
      title: 'Validation Error',
      message: verror.message || '',
    }));
    return output;
  }

  return undefined;
}

export default { apiOutput };
