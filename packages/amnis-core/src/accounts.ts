import { challengeCreator, Credential } from './entity/index.js';
import {
  authRegistrationCreate,
} from './io/io.auth.js';

export interface Account {
  name: string;
  credential: Credential;
  password: string;
  privateKey: string;
}

const challenge = challengeCreator({ value: '' });

let admin: Account;
let exec: Account;
let user: Account;

export const accountsGet = async () => {
  /**
   * Administrator
   */
  if (!admin) {
    const [adminRegistration, adminPrivateKey, adminCredential] = await authRegistrationCreate({
      agent: 'Local Agent',
      username: 'admin',
      password: 'passwd12',
      challenge,
    });

    admin = {
      name: adminRegistration.username,
      credential: adminCredential,
      password: 'passwd12',
      privateKey: adminPrivateKey,
    };
  }

  /**
   * Executive
   */
  if (!exec) {
    const [execRegistration, execPrivateKey, execCredential] = await authRegistrationCreate({
      agent: 'Local Agent',
      username: 'exec',
      password: 'passwd12',
      challenge,
    });

    exec = {
      name: execRegistration.username,
      credential: execCredential,
      password: 'passwd12',
      privateKey: execPrivateKey,
    };
  }

  /**
   * User
   */
  if (!user) {
    const [userRegistration, userPrivateKey, userCredential] = await authRegistrationCreate({
      agent: 'Local Agent',
      username: 'user',
      password: 'passwd12',
      challenge,
    });

    user = {
      name: userRegistration.username,
      credential: userCredential,
      password: 'passwd12',
      privateKey: userPrivateKey,
    };
  }

  return { admin, exec, user };
};

export default accountsGet;
