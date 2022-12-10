import {
  Challenge,
  challengeEncode,
  Credential,
  credentialCreator,
  Entity,
  entityStrip,
} from '../entity/index.js';
import {
  cryptoWeb,
  base64Encode,
  base64Decode,
} from './crypto/index.js';
import type { AuthLogin, AuthRegistration } from './io.auth.types.js';

function generateCanvasFingerprint(agentText: string) {
  // Create a hidden canvas element
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);

  // Get the 2D rendering context for the canvas
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return base64Encode(new Uint8Array([1]));
  }

  // Draw information on the canvas.
  ctx.textBaseline = 'top';
  ctx.font = '14px \'Arial\'';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText(agentText, 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText(agentText, 4, 17);

  // Extract the image data from the canvas and create the fingerprint.
  const imageData = ctx.getImageData(0, 0, 250, 25);
  const fingerprint = base64Encode(new Uint8Array(imageData.data.buffer));

  // Return the canvas fingerprint
  return fingerprint;
}

function getAgentString() {
  if (typeof process === 'undefined') {
    const { userAgent } = window.navigator;
    const agent = userAgent
      .replace(/[\d_./]+/gm, '')
      .match(/\(.*?;/m)?.[0].slice(1, -1) ?? 'Unknown Device';
    if (userAgent.includes('Chrome')) { return `${agent} (Chrome)`; }
    if (userAgent.includes('Firefox')) { return `${agent} (Firefox)`; }
    if (userAgent.includes('Edg')) { return `${agent} (Edge)`; }
    if (userAgent.includes('Opera')) { return `${agent} (Opera)`; }
    if (userAgent.includes('Safari')) { return `${agent} (Safari)`; }
    return agent;
  }

  const agent = process.platform;
  return agent.charAt(0).toUpperCase() + agent.slice(1);
}

function getBlurryFingerprint() {
  if (typeof process === 'undefined') {
    const { maxTouchPoints, hardwareConcurrency } = window.navigator;
    const print = generateCanvasFingerprint(
      `${getAgentString()}${maxTouchPoints}${hardwareConcurrency}`,
    );
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

export interface AuthRegistrationCreateOptions {
  username: string;
  displayName: string;
  password: string;
  challenge: Entity<Challenge> | Challenge;
  origin?: string;
}

export type AuthRegistrationCreate = (
  options: AuthRegistrationCreateOptions
) => Promise<[
  authRegistration: AuthRegistration,
  privateKeyWrapped: string,
  credential: Credential
]>;

/**
 * Creates encoded parameters for a registration.
 */
export const authRegistrationCreate: AuthRegistrationCreate = async ({
  username,
  displayName,
  password,
  challenge,
  origin,
}) => {
  const enc = new TextEncoder();
  const agent = getAgentString();

  /**
   * Encode the challenge.
   */
  const challengeEncoded = base64Encode(
    enc.encode(
      JSON.stringify(entityStrip(challenge as Entity<Challenge>)),
    ),
  );

  /**
   * Create a new credentials
   */
  const credentialKeys = await cryptoWeb.asymGenerate('signer');

  /**
   * Export public key
   */
  const publicKeyExport = await cryptoWeb.keyExport(credentialKeys.publicKey);

  /**
   * Wrap private key.
   */
  const privateKeyWrapped = await cryptoWeb.keyWrap(
    credentialKeys.privateKey,
    await cryptoWeb.hashData(getBlurryFingerprint()),
  );

  const credential = credentialCreator({
    name: agent,
    publicKey: publicKeyExport,
  });

  const credentialEncoded = base64Encode(
    enc.encode(JSON.stringify(credential)),
  );

  /**
   * Sign the credential data to ensure it came from this client.
   */
  const signature = await cryptoWeb.asymSign(
    credentialEncoded,
    credentialKeys.privateKey,
  );

  const signatureEncoded = base64Encode(new Uint8Array(signature));

  /**
   * Configure the origin value.
   */
  let originFinal = origin ?? 'http://localhost';

  if (!origin && typeof window !== 'undefined') {
    originFinal = window.location.origin;
  }

  const authRegistration: AuthRegistration = {
    username,
    password,
    displayName,
    challenge: challengeEncoded,
    type: 'auth.create',
    origin: originFinal,
    credential: credentialEncoded,
    signature: signatureEncoded,
  };

  return [authRegistration, privateKeyWrapped, credential];
};

export interface AuthRegistrationParsed extends Omit<AuthRegistration, 'challenge' | 'credential' | 'signature'> {
  challenge: Challenge;
  credential: Credential;
  signature: ArrayBuffer;
}

export type AuthRegistrationParse = (
  authRegistration: AuthRegistration
) => Promise<AuthRegistrationParsed | undefined>;

/**
 * Parses encoded auth registration parameters.
 */
export const authRegistrationParse: AuthRegistrationParse = async (authRegistration) => {
  try {
    const dec = new TextDecoder();
    const { challenge, credential, signature } = authRegistration;

    const challengeObject = JSON.parse(dec.decode(base64Decode(challenge))) as Challenge;
    const credentialObject = JSON.parse(dec.decode(base64Decode(credential))) as Credential;
    const signatureBuffer = base64Decode(signature).buffer;

    return {
      ...authRegistration,
      challenge: challengeObject,
      credential: credentialObject,
      signature: signatureBuffer,
    };
  } catch (e) {
    return undefined;
  }
};

/**
 * Parameters for the authLoginCreate method.
 */
export interface AuthLoginCreateParams {
  username: string;
  password: string;
  challenge: Challenge;
  credential: Credential;
  privateKeyWrapped: string;
}

export type AuthLoginCreate = (params: AuthLoginCreateParams) => Promise<AuthLogin>;

/**
 * Creates an AuthLogin object.
 */
export const authLoginCreate: AuthLoginCreate = async ({
  username,
  password,
  challenge,
  credential,
  privateKeyWrapped,
}) => {
  const challengeEncoded = challengeEncode(challenge);

  const signatureData = username + credential.$id + challenge.value;

  const privateKey = await cryptoWeb.keyUnwrap(
    privateKeyWrapped,
    await cryptoWeb.hashData(getBlurryFingerprint()),
  ) || (await cryptoWeb.asymGenerate('signer')).privateKey;

  const signature = await cryptoWeb.asymSign(signatureData, privateKey);
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const authLogin: AuthLogin = {
    username,
    password,
    challenge: challengeEncoded,
    $credential: credential.$id,
    signature: signatureEncoded,
  };

  return authLogin;
};
