/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */

import type { JWTAccess } from '../../jwt.types.js';
import type { Session, LogCreator } from '../../entity/index.js';

/**
 * String representation of a SHA256 encoded string.
 */
export enum CryptoHashNominal { _ = '' }
export type CryptoHash = CryptoHashNominal & string;

/**
 * String representation of a AES cipher encryption string.
 */
export enum CryptoSymKeyNominal { _ = '' }
export enum CryptoSymEncryptionNominal { _ = '' }
export type CryptoSymKey = CryptoSymKeyNominal & CryptoKey;
export type CryptoSymEncryption = CryptoSymEncryptionNominal & string;

/**
 * String representation of an RSA cipher encryption string.
 */
export enum CryptoAsymNominal { _ = '' }
export enum CryptoAsymSignatureNominal { _ = '' }
export type CryptoAsymEncryption = CryptoAsymNominal & ArrayBuffer;
export type CryptoAsymSignature = CryptoAsymSignatureNominal & ArrayBuffer;

/**
 * String representation of RSA public and private encryption strings.
 */
export enum CryptoAsymPrivateKeyNominal { _ = '' }
export type CryptoAsymPrivateKey = CryptoAsymPrivateKeyNominal & CryptoKey;
export enum CryptoAsymPublicKeyNominal { _ = '' }
export type CryptoAsymPublicKey = CryptoAsymPublicKeyNominal & CryptoKey;

/**
 * String representation of a hashed password.
 */
export enum CryptoPasswordNominal { _ = '' }
export type CryptoPassword = CryptoPasswordNominal & string;

/**
 * String representation of an encoded object.
 */
export enum CryptoTokenNominal { _ = '' }
export type CryptoToken = CryptoTokenNominal & string;

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
export type CryptoHashData = (data: string) => Promise<CryptoHash>;

/**
 * Generates a new symmetric encyption key.
 */
export type CryptoSymGenerate = () => Promise<CryptoSymKey>;

/**
 * Encrypts with Symmetric AES encrypted text.
 */
export type CryptoSymEncrypt = (
  data: string,
  key?: CryptoSymKey
) => Promise<CryptoSymEncryption>;

/**
 * Decrypts a Symmetric AES encrypted string.
 */
export type CryptoSymDecrypt = (
  encryption: CryptoSymEncryption,
  key?: CryptoSymKey
) => Promise<string | undefined>;

/**
 * Generates an Asymmetric RSA encrypted key pair for encryption.
 */
export type CryptoAsymGenerate = (type: 'encryptor' | 'signer') => Promise<CryptoAsymKeyPair>;

/**
 * Encrypts with an Asymmetric RSA encrypted public key.
 */
export type CryptoAsymEncrypt = (
  data: string,
  publicKey?: CryptoAsymPublicKey
) => Promise<CryptoAsymEncryption>;

/**
 * Decrypts with an Asymmetric RSA encrypted private key.
 */
export type CryptoAsymDecrypt = (
  encryption: CryptoAsymEncryption,
  privateKey?: CryptoAsymPrivateKey
) => Promise<string | undefined>;

/**
 * Signs with an Asymmetric RSA encrypted private key.
 */
export type CryptoAsymSign = (
  data: string,
  privateKey?: CryptoAsymPrivateKey
) => Promise<CryptoAsymSignature>;

/**
 * Verifies with an Asymmetric RSA encrypted public key.
 */
export type CryptoAsymVerify = (
  data: string,
  signature: CryptoAsymSignature,
  publicKey?: CryptoAsymPublicKey
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
export type CryptoSessionEncrypt = (
  session: Session,
  key?: CryptoSymKey
) => Promise<CryptoSymEncryption>;

/**
 * Verifies an encoded session.
 */
export type CryptoSessionDecrypt = (
  encryption: CryptoSymEncryption,
  key?: CryptoSymKey
) => Promise<Session | undefined>;

/**
 * Encodes a bearer instance.
 */
export type CryptoAccessEncode = (
  access: JWTAccess,
  privateKey?: CryptoAsymPrivateKey
) => Promise<CryptoToken>;

/**
 * Verifies an encoded session.
 */
export type CryptoAccessVerify = (
  encoded: CryptoToken,
  publicKey?: CryptoAsymPublicKey
) => Promise<JWTAccess | LogCreator>;

/**
 * Encodes a JSON value.
 */
export type CryptoTokenEncode = (
  json: any,
  privateKey?: CryptoAsymPrivateKey
) => Promise<CryptoToken>;

/**
 * Verifies an encoded value.
 */
export type CryptoTokenVerify = <T = any>(
  encoded: CryptoToken,
  publicKey?: CryptoAsymPublicKey
) => Promise<T | undefined>;

/**
 * Decodes an encoded value without verifying.
 */
export type CryptoTokenDecode = <T = any>(encoded: CryptoToken) => Promise<T>;

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
  hashData: CryptoHashData;

  /**
   * Generates a new AES key for encryption.
   */
  symGenerate: CryptoSymGenerate;

  /**
   * Generates a new AES Encryption.
   */
  symEncrypt: CryptoSymEncrypt;

  /**
   * Gets a singleton AES encrypted key pair.
   */
  symDecrypt: CryptoSymDecrypt;

  /**
   * Generates a new RSA encryption keypair.
   */
  asymGenerate: CryptoAsymGenerate;

  /**
   * Gets a singleton RSA encrypted key pair.
   */
  asymSingleton: CryptoAsymGenerate;

  /**
   * Encrypts data using a public key.
   */
  asymEncrypt: CryptoAsymEncrypt;

  /**
   * Decrypts data using a private key.
   */
  asymDecrypt: CryptoAsymDecrypt;

  /**
   * Signs data using a private key.
   */
  asymSign: CryptoAsymSign;

  /**
   * Verifies data using a private key.
   */
  asymVerify: CryptoAsymVerify;

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
  sessionEncrypt: CryptoSessionEncrypt;

  /**
   * Verifies a session encoding.
   */
  sessionDecrypt: CryptoSessionDecrypt;

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
