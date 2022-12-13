import {
  Challenge,
  challengeEncode,
  credentialCreator,
  credentialKey,
} from './entity/index.js';
import {
  AuthLogin,
  AuthRegistration, base64Decode, base64Encode, cryptoWeb,
} from './io/index.js';
import { localStorage } from './localstorage.js';
import { UID } from './types.js';
import { uid } from './uid.js';

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
  const enc = new TextEncoder();
  const encoded = base64Encode(enc.encode(JSON.stringify(agent)));

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
        const dec = new TextDecoder();
        const decoded = JSON.parse(dec.decode(base64Decode(encoded))) as Agent;
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

  const enc = new TextEncoder();
  const credentialEncoded = base64Encode(
    enc.encode(JSON.stringify(credential)),
  );

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
 * Create an AuthRegistration with agent properties.
 */
export const agentRegistration = async (
  username: string,
  displayName: string,
  password: string,
  challenge: Challenge,
): Promise<AuthRegistration> => {
  const challengeEncoded = challengeEncode(challenge);

  let origin = 'http://localhost';

  if (!origin && typeof window !== 'undefined') {
    origin = window.location.origin;
  }

  const credential = await agentCredential();
  const signature = await agentSign(credential);

  const authRegistration: AuthRegistration = {
    username,
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
 * Create an AuthLogin for this agent.
 */
export const agentLogin = async (
  username: string,
  password:string,
  challenge: Challenge,
) => {
  const agentCurrent = await agentGet();
  const challengeEncoded = challengeEncode(challenge);

  const signatureData = username + agentCurrent.credentialId + challenge.value;
  const signature = await agentSign(signatureData);

  const authLogin: AuthLogin = {
    username,
    password,
    challenge: challengeEncoded,
    $credential: agentCurrent.credentialId,
    signature,
  };

  return authLogin;
};
