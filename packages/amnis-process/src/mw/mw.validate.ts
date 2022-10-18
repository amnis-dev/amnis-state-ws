import type { IoMiddleware } from '@amnis/core/index.js';
import { validate } from '../validate.js';

/**
 * Middleware that validates the input body with the context validator.
 */
export const mwValidate: IoMiddleware<string> = (
  (validatorKey) => (next) => (context) => async (input) => {
    const { validators } = context;
    /**
     * Validate the body.
     */
    const validateOutput = validate(validators[validatorKey], input.body);
    if (validateOutput) {
      return validateOutput;
    }

    return next(context)(input);
  }
);

export default { mwValidate };
