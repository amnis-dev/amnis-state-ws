import { passCompare } from '@amnis/auth/pass';
import { mwValidate } from '../mw.validate';
import { ApiProcess } from '../types';
import { ApiAuthIOLogin } from './auth.types';
import { userFindByName, outputBadCredentials, loginSuccessProcess } from './auth.utility';

const process: ApiProcess<ApiAuthIOLogin> = (context) => (
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

export const authProcessLogin = mwValidate('ApiAuthBodyLogin')(
  process,
);

export default { authProcessLogin };
