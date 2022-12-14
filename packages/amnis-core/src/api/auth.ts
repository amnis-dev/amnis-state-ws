import {
  agentFingerprint,
  agentName,
} from '../agent.js';
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
} from '../io/crypto/index.js';
import type {
  ApiAuthLogin,
  ApiAuthRegistration,
} from './auth.types.js';

/**
 * I don't know how reliable/consistent this is to use as a unique password yet.
 */
// function generateCanvasFingerprint(agentText: string) {
//   // Create a hidden canvas element
//   const canvas = document.createElement('canvas');
//   canvas.style.display = 'none';
//   document.body.appendChild(canvas);

//   // Get the 2D rendering context for the canvas
//   const ctx = canvas.getContext('2d');

//   if (!ctx) {
//     return base64Encode(new Uint8Array([1]));
//   }

//   // Draw information on the canvas.
//   ctx.textBaseline = 'top';
//   ctx.font = '14px \'Arial\'';
//   ctx.textBaseline = 'alphabetic';
//   ctx.fillStyle = '#f60';
//   ctx.fillRect(125, 1, 62, 20);
//   ctx.fillStyle = '#069';
//   ctx.fillText(agentText, 2, 15);
//   ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
//   ctx.fillText(agentText, 4, 17);

//   // Extract the image data from the canvas and create the fingerprint.
//   const imageData = ctx.getImageData(0, 0, 250, 25);
//   const fingerprint = base64Encode(new Uint8Array(imageData.data.buffer));

//   // Return the canvas fingerprint
//   return fingerprint;
// }

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
  authRegistration: ApiAuthRegistration,
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
  const agent = agentName();

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
    await cryptoWeb.hashData(agentFingerprint()),
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

  const authRegistration: ApiAuthRegistration = {
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

export interface AuthRegistrationParsed extends Omit<ApiAuthRegistration, 'challenge' | 'credential' | 'signature'> {
  challenge: Challenge;
  credential: Credential;
  signature: ArrayBuffer;
}

export type AuthRegistrationParse = (
  authRegistration: ApiAuthRegistration
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

export type AuthLoginCreate = (params: AuthLoginCreateParams) => Promise<ApiAuthLogin>;

/**
 * Creates an ApiAuthLogin object.
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
    await cryptoWeb.hashData(agentFingerprint()),
  ) || (await cryptoWeb.asymGenerate('signer')).privateKey;

  const signature = await cryptoWeb.asymSign(signatureData, privateKey);
  const signatureEncoded = base64Encode(new Uint8Array(signature));

  const authLogin: ApiAuthLogin = {
    username,
    password,
    challenge: challengeEncoded,
    $credential: credential.$id,
    signature: signatureEncoded,
  };

  return authLogin;
};
