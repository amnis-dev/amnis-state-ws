import {
  Challenge,
  Credential,
  credentialCreator,
  Entity,
  entityStrip,
  Log,
  logCreator,
} from '../entity/index.js';
import {
  cryptoWeb,
  base64Encode,
  CryptoAsymSignature,
  base64Decode,
} from './crypto/index.js';
import type { AuthRegistration } from './io.auth.types.js';

export interface AuthRegistrationCreateOptions {
  agent: string;
  username: string;
  password: string;
  challenge: Entity<Challenge> | Challenge;
  origin?: string;
}

export type AuthRegistrationCreate = (
  options: AuthRegistrationCreateOptions
) => Promise<[authRegistration: AuthRegistration, privateKeyWrapped: string]>;

export const authRegistrationCreate: AuthRegistrationCreate = async ({
  agent,
  username,
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
    challenge: challengeEncoded,
    type: 'auth.create',
    origin: originFinal,
    credential: credentialEncoded,
    signature: signatureEncoded,
  };

  return [authRegistration, privateKeyWrapped];
};

export interface AuthRegistrationParsed extends Omit<AuthRegistration, 'challenge' | 'credential' | 'signature'> {
  challenge: Challenge;
  credential: Credential;
  signature: CryptoAsymSignature;
}

export type AuthRegistrationParse = (
  authRegistration: AuthRegistration
) => Promise<AuthRegistrationParsed | Log>;

export const authRegistrationParse: AuthRegistrationParse = async (authRegistration) => {
  try {
    const dec = new TextDecoder();
    const { challenge, credential, signature } = authRegistration;

    const challengeObject = JSON.parse(dec.decode(base64Decode(challenge))) as Challenge;
    const credentialObject = JSON.parse(dec.decode(base64Decode(credential))) as Credential;
    const signatureBuffer = base64Decode(signature).buffer as CryptoAsymSignature;

    return {
      ...authRegistration,
      challenge: challengeObject,
      credential: credentialObject,
      signature: signatureBuffer,
    };
  } catch (e) {
    return logCreator({
      level: 'error',
      title: 'Invalid Encoding',
      description: 'Registration parameters could not be decoded.',
    });
  }
};
