import {
  Io, IoProcess, AuthLogin, StateCreate, CryptoPassword,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';
import { userFindByName, outputBadCredentials, loginSuccessProcess } from '../utility/index.js';

const process: IoProcess<
Io<AuthLogin, StateCreate>
> = (context) => (
  async (input) => {
    const { database, crypto } = context;
    const { body } = input;

    /**
     * CHECK CREDENTIALS
     */
    const { username, password } = body;

    const user = await userFindByName(database, username);

    if (!user) {
      return outputBadCredentials();
    }

    if (!user.password) {
      return outputBadCredentials();
    }

    const same = await crypto.passCompare(password, user.password as CryptoPassword);

    if (same === false) {
      return outputBadCredentials();
    }

    /**
     * SUCCESSFUL LOGIN
     */
    const successOutput = await loginSuccessProcess(context, user);

    return successOutput;
  }
);

export const authProcessLogin = mwValidate('AuthLogin')(
  process,
);

export default { authProcessLogin };
