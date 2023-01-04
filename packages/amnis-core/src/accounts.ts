/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  agentCredential, agentFingerprint, agentGet, agentName,
} from './agent.js';
import { Credential, credentialCreator } from './entity/index.js';
import { cryptoWeb } from './io/index.js';
import { base64Encode } from './base64.js';

export interface Account {
  handle: string;
  credential: Credential;
  password: string;
  privateKey: string;
}

let admin: Account;
let exec: Account;
let user: Account;

export const accountsSign = async (
  privateKeyWrapped: string,
  data: Record<string, any>,
): Promise<string> => {
  const privateKey = await cryptoWeb.keyUnwrap(
    privateKeyWrapped,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  if (!privateKey) {
    expect(privateKey).toBeDefined();
  }

  const signature = await cryptoWeb.asymSign(JSON.stringify(data), privateKey);
  return base64Encode(new Uint8Array(signature));
};

export const accountsGenerateCrypto = async () => {
  const keys = await cryptoWeb.asymGenerate('signer');
  const publicKey = await cryptoWeb.keyExport(keys.publicKey);
  const privateKey = await cryptoWeb.keyWrap(
    keys.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  const credential = credentialCreator({
    name: agentName(),
    publicKey,
  });
  return { credential, privateKey };
};

export const accountsGet = async () => {
  /**
   * Administrator
   */
  if (!admin) {
    const { credential, privateKey } = await accountsGenerateCrypto();
    admin = {
      handle: 'admin',
      password: 'passwd12',
      credential,
      privateKey,
    };
  }

  /**
   * Executive
   */
  if (!exec) {
    const { credential, privateKey } = await accountsGenerateCrypto();
    exec = {
      handle: 'exec',
      password: 'passwd12',
      credential,
      privateKey,
    };
  }

  /**
   * User
   */
  if (!user) {
    const agent = await agentGet();

    user = {
      handle: 'user',
      credential: await agentCredential(),
      password: 'passwd12',
      privateKey: agent.privateKey,
    };
  }

  return { admin, exec, user };
};

export default accountsGet;
