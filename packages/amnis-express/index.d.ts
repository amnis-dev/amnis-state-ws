import type { ApiContext, ApiInput, ApiOutput } from '@amnis/state/index';

declare global{
  namespace Express {
    interface Request {
      input: ApiInput;
    }
    interface Response {
      output: (output: ApiOutput) => void;
    }
  }
}
