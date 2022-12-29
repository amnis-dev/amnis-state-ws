import { agentGet } from './agent.js';
import { challengeCreator, Credential, credentialCreator } from './entity/index.js';
import {
  apiAuthRegistrationCreate,
} from './api/api.auth.js';

export interface Account {
  handle: string;
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
    const [adminRegistration, adminPrivateKey, adminCredential] = await apiAuthRegistrationCreate({
      handle: 'admin',
      displayName: 'Administrator',
      password: 'passwd12',
      challenge,
    });

    admin = {
      handle: adminRegistration.handle,
      credential: adminCredential,
      password: 'passwd12',
      privateKey: adminPrivateKey,
    };
  }

  /**
   * Executive
   */
  if (!exec) {
    const [execRegistration, execPrivateKey, execCredential] = await apiAuthRegistrationCreate({
      handle: 'exec',
      displayName: 'Executive',
      password: 'passwd12',
      challenge,
    });

    exec = {
      handle: execRegistration.handle,
      credential: execCredential,
      password: 'passwd12',
      privateKey: execPrivateKey,
    };
  }

  /**
   * User
   */
  if (!user) {
    const agent = await agentGet();

    user = {
      handle: 'user',
      credential: credentialCreator({
        name: agent.name,
        publicKey: agent.publicKey,
      }),
      password: 'passwd12',
      privateKey: agent.privateKey,
    };
  }

  return { admin, exec, user };
};

export default accountsGet;
