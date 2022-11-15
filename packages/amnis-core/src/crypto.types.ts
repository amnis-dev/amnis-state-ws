/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */

import { JWTAccess } from './index.js';
import { Session } from './session/index.js';

/**
 * String representation of a SHA256 encoded string.
 */
export enum CryptoSHA256Nominal { _ = '' }
export type CryptoSHA256 = CryptoSHA256Nominal & string;

/**
 * String representation of a AES cipher encryption string.
 */
export enum CryptoAESNominal { _ = '' }
export type CryptoAES = CryptoAESNominal & string;

/**
 * String representation of RSA public and private encryption strings.
 */
export enum CryptoRSAPrivateKeyNominal { _ = '' }
export type CryptoRSAPrivateKey = CryptoRSAPrivateKeyNominal & string;
export enum CryptoRSAPublicKeyNominal { _ = '' }
export type CryptoRSAPublicKey = CryptoRSAPublicKeyNominal & string;

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
export type CryptoRSAKeyPair = { privateKey: CryptoRSAPrivateKey, publicKey: CryptoRSAPublicKey };

/**
 * Random String method.
 */
export type CryptoRandomString = (length?: number) => Promise<string>;

/**
 * Hashes a string with SHA256.
 */
export type CryptoHashSHA256 = (plain: string) => Promise<string>;

/**
 * Generates an AES encrypted string.
 */
export type CryptoEncryptAES = () => Promise<CryptoAES>;

/**
 * Generates an RSA encrypted key pair.
 */
export type CryptoEncryptRSA = () => Promise<CryptoRSAKeyPair>;

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
  session: Session,
  secret?: string
) => Promise<CryptoEncoded>;

/**
 * Verifies an encoded session.
 */
export type CryptoSessionVerify = (
  encoded: CryptoEncoded,
  secret?: string
) => Promise<Session>;

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
) => Promise<JWTAccess>;

/**
 * Decodes an encoded value without verifying.
 */
export type CryptoTokenDecode = <T = Record<string, any>>(encoded: CryptoEncoded) => Promise<T>;

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
  encryptAes: CryptoEncryptAES;

  /**
    * Gets a singleton AES encrypted key pair.
    */
  encryptAesSingleton: CryptoEncryptAES;

  /**
   * Generates a new RSA Encryption keypair.
   */
  encryptRsa: CryptoEncryptRSA;

  /**
   * Gets a singleton RSA encrypted key pair.
   */
  encryptRsaSingleton: CryptoEncryptRSA;

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
