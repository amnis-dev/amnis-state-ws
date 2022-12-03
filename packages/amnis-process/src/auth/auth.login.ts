import {
  Io, IoProcess, AuthLogin, StateEntities,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';
import { userFindByName, outputBadCredentials, loginSuccessProcess } from '../utility/index.js';

const process: IoProcess<
Io<AuthLogin, StateEntities>
> = (context) => (
  async (input) => {
    const { database } = context;
    const { body } = input;

    /**
     * CHECK CREDENTIALS
     */
    const { username } = body;

    const user = await userFindByName(database, username);

    if (!user) {
      return outputBadCredentials();
    }

    // if (!user.password) {
    //   return outputBadCredentials();
    // }

    // const same = await crypto.passCompare(password, user.password as CryptoPassword);
    const same = false;

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
