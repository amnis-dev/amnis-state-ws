/* eslint-disable @typescript-eslint/no-explicit-any */
import { agentFingerprint, agentGet } from './agent.js';
import { Credential, credentialCreator } from './entity/index.js';
import { challengeCreate } from './state/index.js';
import {
  apiAuthRegistrationCreate,
} from './api/api.auth.js';
import { cryptoWeb } from './io/index.js';
import { base64Encode, base64JsonEncode } from './base64.js';

export interface Account {
  handle: string;
  credential: Credential;
  password: string;
  privateKey: string;
}

const challenge = challengeCreate({ val: '' });

let admin: Account;
let exec: Account;
let user: Account;

export const accountsSign = async (
  account: Account,
  data: Record<string, any>,
): Promise<string> => {
  const privateKey = await cryptoWeb.keyUnwrap(
    account.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  if (!privateKey) {
    expect(privateKey).toBeDefined();
  }

  const signature = await cryptoWeb.asymSign(JSON.stringify(data), privateKey);
  return base64Encode(new Uint8Array(signature));
};

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
