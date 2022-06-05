import { ApiOutput } from './types';

export function apiOutput(): ApiOutput {
  return {
    status: 200,
    cookies: {},
    json: {
      errors: [],
      result: undefined,
      expire: undefined,
    },
  };
}

export default { apiOutput };
