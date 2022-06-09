import Ajv from 'ajv';
import authSchema from './auth.schema.json';
import { apiOutput, apiValidate } from '../api';
import type {
  ApiAuthProcesses,
} from './auth.types';

export function apiAuthProcesses(): ApiAuthProcesses {
  const ajv = new Ajv({ schemas: [authSchema] });
  const validators = {
    login: ajv.getSchema('auth#/definitions/ApiAuthLoginBody'),
    authorize: ajv.getSchema('auth#/definitions/ApiAuthAuthorizeBody'),
  };

  return {
    /**
     * API Handler for a typical username and password login attempt.
     */
    login: (input) => {
      const output = apiOutput();
      const { body } = input;

      const validateOutput = apiValidate(validators.login, body);
      if (validateOutput) {
        return validateOutput;
      }

      return output;
    },
    /**
     * API handler for creating new data in storage.
     */
    authorize: (input) => {
      const output = apiOutput();
      const { body } = input;

      const validateOutput = apiValidate(validators.authorize, body);
      if (validateOutput) {
        return validateOutput;
      }

      // switch (method) {
      //   case 'msgraph':
      //     // do nothing.
      //     break;

      //   default:
      // }

      return output;
    },
  };
}

export default apiAuthProcesses;
