import {
  Challenge,
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
import type { AuthRegistration } from './io.auth.types.js';

export interface AuthRegistrationCreateOptions {
  agent: string;
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

export const authRegistrationCreate: AuthRegistrationCreate = async ({
  agent,
  username,
  displayName,
  password,
  challenge,
  origin,
}) => {
  const enc = new TextEncoder();

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
    password,
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
