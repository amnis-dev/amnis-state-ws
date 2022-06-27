import { apiValidate } from './api';
import type {
  ApiMiddleware,
} from './types';

/**
 * Middleware that validates the input body with the context validator.
 */
export const mwValidate: ApiMiddleware = (next) => (context) => async (input) => {
  /**
     * Validate the body.
     */
  const validateOutput = apiValidate(context.validator, input.body);
  if (validateOutput) {
    return validateOutput;
  }

  return next(context)(input);
};

export default { mwValidate };
