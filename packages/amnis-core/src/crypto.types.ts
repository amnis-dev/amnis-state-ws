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
 * Generates AES encrypted text.
 */
export type CryptoAESEncrypt = (plaintext: string, key: string) => Promise<CryptoAES>;

/**
 * Decrypts an AES encrypted string.
 */
export type CryptoAESDecrypt = (encryption: CryptoAES, key: string) => Promise<string>;

/**
 * Generates an RSA encrypted key pair.
 */
export type CryptoRSAGenerate = () => Promise<CryptoRSAKeyPair>;

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
  aesEncrypt: CryptoAESEncrypt;

  /**
   * Gets a singleton AES encrypted key pair.
   */
  aesDecrypt: CryptoAESDecrypt;

  /**
   * Generates a new RSA Encryption keypair.
   */
  rsaGenerate: CryptoRSAGenerate;

  /**
   * Gets a singleton RSA encrypted key pair.
   */
  rsaSingleton: CryptoRSAGenerate;

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
