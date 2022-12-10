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
      username: 'admin',
      displayName: 'Administrator',
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
      username: 'exec',
      displayName: 'Executive',
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
      username: 'user',
      displayName: 'User',
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
