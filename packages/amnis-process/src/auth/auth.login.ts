import {
  Io, IoProcess, AuthLogin, StateCreate,
} from '@amnis/core';
import { passCompare } from '../crypto/index.js';
import { mwValidate } from '../mw/index.js';
import { userFindByName, outputBadCredentials, loginSuccessProcess } from '../utility/index.js';

const process: IoProcess<
Io<AuthLogin, StateCreate>
> = (context) => (
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

export const authProcessLogin = mwValidate('AuthLogin')(
  process,
);

export default { authProcessLogin };
