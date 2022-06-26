import { apiValidate } from './api';
import type {
  ApiContext, ApiContextMethod, ApiInput,
} from './types';

/**
 * Middleware that validates the input body with the context validator.
 */
export const mwValidate = (next: ApiContextMethod) => (
  (context: ApiContext) => async (input: ApiInput) => {
    /**
     * Validate the body.
     */
    const validateOutput = apiValidate(context.validator, input.body);
    if (validateOutput) {
      return validateOutput;
    }

    return next(context)(input);
  }
);

export default { mwValidate };
