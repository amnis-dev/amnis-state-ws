import {
  IoContext,
  IoOutput,
  StateEntities,
  credentialCreator,
  ApiAuthRegistrationParsed,
} from '@amnis/core';
import { accountCreate } from './account.js';

/**
 * Accounts the registration process creating and return the new account information.
 */
export const registerAccount = async (
  context: IoContext,
  authRegistrationParsed: ApiAuthRegistrationParsed,
  ip?: string,
): Promise<IoOutput<StateEntities | undefined>> => {
  /**
   * Create the new credential to store in the database.
   */
  const credential = credentialCreator({
    name: authRegistrationParsed.credential.name,
    publicKey: authRegistrationParsed.credential.publicKey,
    ip,
  });

  const output = await accountCreate(
    context,
    {
      handle: authRegistrationParsed.username,
      password: authRegistrationParsed.password,
      email: authRegistrationParsed.email,
      credential,
    },
  );

  return output;
};

export default { registerAccount };
