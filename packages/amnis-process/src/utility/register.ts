import {
  IoContext,
  IoOutput,
  StateEntities,
  credentialCreator,
  ApiAuthRegistration,
} from '@amnis/core';
import { accountCreate } from './account.js';

/**
 * Accounts the registration process creating and return the new account information.
 */
export const registerAccount = async (
  context: IoContext,
  apiAuthRegistration: ApiAuthRegistration,
  ip?: string,
): Promise<IoOutput<StateEntities | undefined>> => {
  /**
   * Create the new credential to store in the database.
   */
  const credential = credentialCreator({
    name: apiAuthRegistration.credential.name,
    publicKey: apiAuthRegistration.credential.publicKey,
    ip,
  });

  const output = await accountCreate(
    context,
    {
      handle: apiAuthRegistration.handle,
      password: apiAuthRegistration.password,
      email: apiAuthRegistration.email,
      credential,
    },
  );

  return output;
};

export default { registerAccount };
