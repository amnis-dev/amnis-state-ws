import { passCompare } from '@amnis/auth/pass';
import { ApiContextMethod } from '../types';
import { ApiAuthProcessLogin } from './auth.types';
import { userFindByName, outputBadCredentials, loginSuccessProcess } from './auth.utility';

export const authProcessLogin: ApiContextMethod = (context): ApiAuthProcessLogin => (
  async (input) => {
    const { database } = context;
    const { body } = input;

    /**
     * CHECK CREDENTIALS
     */
    const { username, password } = body;

    const user = await userFindByName(database, username);

    if (!user) {
      return outputBadCredentials();
    }

    if (user.password === null || user.password.length < 8) {
      return outputBadCredentials();
    }

    const same = await passCompare(password, user.password);

    if (same === false) {
      return outputBadCredentials();
    }

    /**
     * SUCCESSFUL LOGIN
     */

    const successOutput = await loginSuccessProcess(database, user);

    return successOutput;
  }
);

export default { authProcessLogin };
