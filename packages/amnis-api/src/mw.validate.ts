import { apiValidate } from './api.js';
import type {
  ApiMiddleware,
} from './types.js';

/**
 * Middleware that validates the input body with the context validator.
 */
export const mwValidate: ApiMiddleware<string> = (
  (validatorKey) => (next) => (context) => async (input) => {
    const { validators } = context;
    /**
     * Validate the body.
     */
    const validateOutput = apiValidate(validators[validatorKey], input.body);
    if (validateOutput) {
      return validateOutput;
    }

    return next(context)(input);
  }
);

export default { mwValidate };
