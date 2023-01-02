import type {
  IoMiddleware,
  Credential,
  UID,
} from '@amnis/core';
import { findCredentialById } from '../utility/find.js';

/**
 * Attempts to find and set the current client credential.
 */
export const mwCredential: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { session, body: { $credential } } = input;

  if (!$credential && !session) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'A previous authorization is required.',
    });
    return output;
  }

  const $id: UID<Credential> = $credential ?? session?.$credential;

  const credential = await findCredentialById(context, $id);

  if (!credential) {
    output.status = 401; // 401 Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Unauthorized',
      description: 'The credential provided is not valid.',
    });
    return output;
  }

  input.credential = credential;

  return next(context)(input, output);
};

export default { mwCredential };
