import {
  Challenge,
  challengeEncode,
  credentialCreator,
  credentialKey,
} from './entity/index.js';
import {
  ApiAuthAuthenticate,
  ApiAuthCreate,
  ApiAuthLogin,
  ApiAuthRegistration,
} from './api/index.js';
import {
  cryptoWeb,
} from './io/index.js';
import { localStorage } from './localstorage.js';
import { UID } from './types.js';
import { uid } from './uid.js';
import {
  base64Encode,
  base64JsonDecode,
  base64JsonEncode,
} from './base64.js';

export interface Agent {
  name: string;
  publicKey: string;
  privateKey: string;
  credentialId: UID<Credential>;
}

let agent: Agent | undefined;

/**
 * Gets the agent's name.
 */
export function agentName() {
  if (typeof navigator !== 'undefined') {
    const { userAgent } = navigator;
    const name = userAgent
      .replace(/[\d_./]+/gm, '')
      .match(/\(.*?;/m)?.[0].slice(1, -1)
      .trim() ?? 'Unknown Device';
    if (userAgent.includes('Chrome')) { return `${name} (Chrome)`; }
    if (userAgent.includes('Firefox')) { return `${name} (Firefox)`; }
    if (userAgent.includes('Edg')) { return `${name} (Edge)`; }
    if (userAgent.includes('Opera')) { return `${name} (Opera)`; }
    if (userAgent.includes('Safari')) { return `${name} (Safari)`; }
    return name;
  }

  const name = process.platform ?? 'Unknown Platform';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Gets the agent's fingerprint.
 */
export function agentFingerprint() {
  if (typeof navigator !== 'undefined') {
    const { maxTouchPoints, hardwareConcurrency } = navigator;
    // const print = generateCanvasFingerprint(
    const print = `${agentName()}${maxTouchPoints}${hardwareConcurrency}`;
    // );
    return print;
  }

  const { title, platform } = process;
  const str = title + platform;
  const codes = str.split('').map(
    (c) => (
      c.charCodeAt(0) % 89
    ) + 33,
  );
  const print = base64Encode(new Uint8Array(codes));
  return print;
}

/**
 * Create new agent keys.
 */
export const agentCreate = async (): Promise<Agent> => {
  /**
   * Get the agent name.
   */
  const name = agentName();
  /**
   * Create a new keys
   */
  const asymKeys = await cryptoWeb.asymGenerate('signer');
  /**
   * Export the public key
   */
  const publicKey = await cryptoWeb.keyExport(asymKeys.publicKey);
  /**
   * Wrap the private key.
   */
  const privateKey = await cryptoWeb.keyWrap(
    asymKeys.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );
  /**
   * Create credentialId.
   */
  const credentialId = uid(credentialKey);

  /**
   * Create the new agent.
   */
  agent = {
    name,
    publicKey,
    privateKey,
    credentialId,
  };

  /**
   * Encode the agent.
   */
  const encoded = base64JsonEncode(agent);

  localStorage.setItem('agent', encoded);

  return agent;
};

/**
 * Gets the agent singleton.
 */
export const agentGet = async (): Promise<Agent> => {
  if (!agent) {
    const encoded = localStorage.getItem('agent');
    if (encoded) {
      try {
        const decoded = base64JsonDecode<Agent>(encoded);
        agent = decoded;
      } catch (e) {
        agent = await agentCreate();
      }
    }
    if (!agent) {
      agent = await agentCreate();
    }
  }

  return agent;
};

/**
 * Gets the agent's encoded credential.
 */
export const agentCredential = async (): Promise<string> => {
  const agentCurrent = await agentGet();
  const credential = credentialCreator({
    name: agentCurrent.name,
    publicKey: agentCurrent.publicKey,
  });
  credential.$id = agentCurrent.credentialId;

  const credentialEncoded = base64JsonEncode(credential);

  return credentialEncoded;
};

/**
 * Signs data with the agent keys.
 */
export const agentSign = async (data: string): Promise<string> => {
  const agentCurrent = await agentGet();
  const privateKey = await cryptoWeb.keyUnwrap(
    agentCurrent.privateKey,
    await cryptoWeb.hashData(agentFingerprint()),
  );

  const signature = await cryptoWeb.asymSign(
    data,
    privateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));
  return signatureEncoded;
};

/**
 * Create an ApiAuthRegistration with agent properties.
 */
export const agentApiRegistration = async (
  handle: string,
  displayName: string,
  password: string,
  challenge: Challenge,
): Promise<ApiAuthRegistration> => {
  const challengeEncoded = challengeEncode(challenge);

  let origin = 'http://localhost';

  if (!origin && typeof window !== 'undefined') {
    origin = window.location.origin;
  }

  const credential = await agentCredential();
  const signature = await agentSign(credential);

  const authRegistration: ApiAuthRegistration = {
    handle,
    password,
    displayName,
    challenge: challengeEncoded,
    type: 'auth.create',
    origin,
    credential,
    signature,
  };

  return authRegistration;
};

/**
 * Create an ApiAuthAuthenticate for this agent.
 */
export const agentApiAuthenticate = async (
  challenge: Challenge,
): Promise<ApiAuthAuthenticate> => {
  const challengeEncoded = challengeEncode(challenge);
  const signature = await agentSign(challengeEncoded);

  const authAuthenticate: ApiAuthAuthenticate = {
    challenge: challengeEncoded,
    signature,
  };

  return authAuthenticate;
};

/**
 * Create an ApiAuthLogin for this agent.
 */
export const agentApiLogin = async (
  handle: string,
  password:string,
  challenge: Challenge,
): Promise<ApiAuthLogin> => {
  const agentCurrent = await agentGet();
  const challengeEncoded = challengeEncode(challenge);

  const signatureData = handle + agentCurrent.credentialId;
  const signature = await agentSign(signatureData);

  const authLogin: ApiAuthLogin = {
    handle,
    password,
    challenge: challengeEncoded,
    $credential: agentCurrent.credentialId,
    signature,
  };

  return authLogin;
};

/**
 * Create an ApiAuthCreate for this agent.
 */
export const agentApiCreate = async (
  challenge: Challenge,
  options: Omit<ApiAuthCreate, 'challenge' | 'signature'>,
): Promise<ApiAuthCreate> => {
  const challengeEncoded = challengeEncode(challenge);

  const signatureData = Object.values(options).reduce<string>(
    (acc, cur) => acc + cur,
    '',
  );
  const signatureEncoded = await agentSign(signatureData);

  const authCreate: ApiAuthCreate = {
    challenge: challengeEncoded,
    signature: signatureEncoded,
    ...options,
  };
  return authCreate;
};
