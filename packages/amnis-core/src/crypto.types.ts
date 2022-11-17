/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */

import { JWTAccess } from './jwt.types.js';
import { EntityCreator } from './entity/index.js';
import { Session } from './session/index.js';

/**
 * String representation of a SHA256 encoded string.
 */
export enum CryptoSHA256Nominal { _ = '' }
export type CryptoSHA256 = CryptoSHA256Nominal & string;

/**
 * String representation of a AES cipher encryption string.
 */
export enum CryptoSymNominal { _ = '' }
export type CryptoSym = CryptoSymNominal & string;

/**
 * String representation of an RSA cipher encryption string.
 */
export enum CryptoAsymNominal { _ = '' }
export enum CryptoAsymSignatureNominal { _ = '' }
export type CryptoAsymEncryption = CryptoAsymNominal & Buffer;
export type CryptoAsymSignature = CryptoAsymSignatureNominal & Buffer;

/**
 * String representation of RSA public and private encryption strings.
 */
export enum CryptoAsymPrivateKeyNominal { _ = '' }
export type CryptoAsymPrivateKey = CryptoAsymPrivateKeyNominal & string;
export enum CryptoAsymPublicKeyNominal { _ = '' }
export type CryptoAsymPublicKey = CryptoAsymPublicKeyNominal & string;

/**
 * String representation of a hashed password.
 */
export enum CryptoPasswordNominal { _ = '' }
export type CryptoPassword = CryptoPasswordNominal & string;

/**
 * String representation of an encoded object.
 */
export enum CryptoEncodedNominal { _ = '' }
export type CryptoEncoded = CryptoEncodedNominal & string;

/**
 * An RSA assymetric key pair type.
 */
export type CryptoAsymKeyPair = {
  privateKey: CryptoAsymPrivateKey,
  publicKey: CryptoAsymPublicKey
};

/**
 * Random String method.
 */
export type CryptoRandomString = (length?: number) => Promise<string>;

/**
 * Hashes a string with SHA256.
 */
export type CryptoHashSHA256 = (plain: string) => Promise<string>;

/**
 * Encrypts with Symmetric AES encrypted text.
 */
export type CryptoSymEncrypt = (plaintext: string, key: string) => Promise<CryptoSym>;

/**
 * Decrypts a Symmetric AES encrypted string.
 */
export type CryptoSymDecrypt = (encryption: CryptoSym, key: string) => Promise<string>;

/**
 * Generates an Asymmetric RSA encrypted key pair.
 */
export type CryptoAsymGenerate = () => Promise<CryptoAsymKeyPair>;

/**
 * Encrypts with an Asymmetric RSA encrypted public key.
 */
export type CryptoAsymEncrypt = (
  data: string,
  publicKey?: CryptoAsymKeyPair['publicKey']
) => Promise<CryptoAsymEncryption>;

/**
 * Decrypts with an Asymmetric RSA encrypted private key.
 */
export type CryptoAsymDecrypt = (
  encryption: CryptoAsymEncryption,
  privateKey?: CryptoAsymKeyPair['privateKey']
) => Promise<string>;

/**
 * Signs with an Asymmetric RSA encrypted private key.
 */
export type CryptoAsymSign = (
  data: string,
  privateKey?: CryptoAsymKeyPair['privateKey']
) => Promise<CryptoAsymSignature>;

/**
 * Verifies with an Asymmetric RSA encrypted private key.
 */
export type CryptoAsymVerify = (
  data: string,
  signature: CryptoAsymSignature,
  privateKey?: CryptoAsymKeyPair['privateKey']
) => Promise<boolean>;

/**
 * Hashes a plaintext password.
 */
export type CryptoPassHash = (plaintext: string) => Promise<CryptoPassword>;

/**
 * Compares a plaintext password and a hashed password.
 * Returns true if the passwords match.
 */
export type CryptoPassCompare = (plaintext: string, hashtext: CryptoPassword) => Promise<boolean>;

/**
 * Encodes a session instance.
 */
export type CryptoSessionEncode = (
  session: EntityCreator<Session>,
  secret?: string
) => Promise<CryptoEncoded>;

/**
 * Verifies an encoded session.
 */
export type CryptoSessionVerify = (
  encoded: CryptoEncoded,
  secret?: string
) => Promise<Session | undefined>;

/**
 * Encodes a bearer instance.
 */
export type CryptoAccessEncode = (
  access: JWTAccess,
  secret?: string
) => Promise<CryptoEncoded>;

/**
 * Verifies an encoded session.
 */
export type CryptoAccessVerify = (
  encoded: CryptoEncoded,
  secret?: string
) => Promise<JWTAccess | undefined>;

/**
 * Decodes an encoded value without verifying.
 */
export type CryptoTokenDecode = <T = any>(encoded: CryptoEncoded) => Promise<T>;

/**
 * Core interface for cryptographic methods.
 */
export interface Crypto {
  /**
   * Generates a random string.
   */
  randomString: CryptoRandomString;

  /**
   * Hashes a plain string using SHA256.
   */
  hashSha256: CryptoHashSHA256;

  /**
   * Generates a new AES Encryption.
   */
  symEncrypt: CryptoSymEncrypt;

  /**
   * Gets a singleton AES encrypted key pair.
   */
  symDecrypt: CryptoSymDecrypt;

  /**
   * Generates a new RSA Encryption keypair.
   */
  asymGenerate: CryptoAsymGenerate;

  /**
   * Gets a singleton RSA encrypted key pair.
   */
  asymSingleton: CryptoAsymGenerate;

  /**
   * Hashes a password.
   */
  passHash: CryptoPassHash;

  /**
   * Compares a plain password to a hashed password.
   */
  passCompare: CryptoPassCompare;

  /**
   * Encodes a session object.
   */
  sessionEncode: CryptoSessionEncode;

  /**
   * Verifies a session encoding.
   */
  sessionVerify: CryptoSessionVerify;

  /**
   * Encodes an access token object.
   */
  accessEncode: CryptoAccessEncode;

  /**
   * Verifies an access encoding.
   */
  accessVerify: CryptoAccessVerify;

  /**
   * Decodes any type of token.
   */
  tokenDecode: CryptoTokenDecode;
}
