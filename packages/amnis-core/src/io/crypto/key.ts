import { base64Decode, base64Encode } from '../../base64.js';
import {
  CryptoKeyExport, CryptoKeyImport, CryptoKeyUnwrap, CryptoKeyWrap,
} from './crypto.types.js';
import { webcrypto } from './webcrypto.js';

const saltLength = 16;
const ivLength = 16;

const keyImportPassword = async (wc: Crypto, password: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const passwordKey = await wc.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  );
  return passwordKey;
};

export const keyWrap: CryptoKeyWrap = async (key, password, type) => {
  const wc = await webcrypto();

  const passwordKey = await keyImportPassword(wc, password);
  const salt = wc.getRandomValues(new Uint8Array(saltLength));
  const iv = wc.getRandomValues(new Uint8Array(ivLength));

  const wrappingKey = await wc.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['wrapKey', 'unwrapKey'],
  );

  const keyWrapped = await wc.subtle.wrapKey('jwk', key, wrappingKey, { name: 'AES-GCM', iv });

  /**
   * Combine with salt with the wrapped encryption.
   */
  const derived = new Uint8Array(keyWrapped);
  const combined = new Uint8Array(1 + salt.length + iv.length + derived.length);

  /**
   * 0 = asym encrypter
   * 1 = asym signer
   * 2 = sym encryptor
   */
  combined.set([type ?? 1]);
  combined.set(salt, 1);
  combined.set(iv, salt.length + 1);
  combined.set(derived, salt.length + iv.length + 1);

  return base64Encode(combined);
};

export const keyUnwrap: CryptoKeyUnwrap = async (wrap, password) => {
  const wc = await webcrypto();

  try {
    const wrapped = base64Decode(wrap);

    const passwordKey = await keyImportPassword(wc, password);
    const type = wrapped[0];
    const salt = wrapped.slice(1, saltLength + 1);
    const iv = wrapped.slice(saltLength + 1, saltLength + ivLength + 1);

    const [algorithm, usage] = ((t) => {
      switch (t) {
        case 0:
          return [
            {
              name: 'RSA-OAEP',
              modulusLength: 4096,
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: 'SHA-256',
            } as RsaHashedImportParams,
            ['decrypt'] as ['decrypt'],
          ];
        case 1:
          return [
            {
              name: 'ECDSA',
              namedCurve: 'P-256',
            } as EcKeyImportParams,
            ['sign'] as ['sign'],
          ];
        default:
          return [
            {
              name: 'AES-GCM',
              length: 256,
            },
            ['encrypt', 'decrypt'] as ['encrypt', 'decrypt'],
          ];
      }
    })(type);

    const unwrappingKey = await wc.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['wrapKey', 'unwrapKey'],
    );

    const keyUnwrapped = await wc.subtle.unwrapKey(
      'jwk',
      wrapped.slice(saltLength + ivLength + 1),
      unwrappingKey,
      { name: 'AES-GCM', iv },
      algorithm,
      true,
      usage,
    );

    return keyUnwrapped;
  } catch (e) {
    return undefined;
  }
};

export const keyExport: CryptoKeyExport = async (key, type) => {
  const wc = await webcrypto();
  const enc = new TextEncoder();

  const keyJwt = await wc.subtle.exportKey('jwk', key);
  const keyEncoded = enc.encode(JSON.stringify(keyJwt));

  const combined = new Uint8Array(1 + keyEncoded.length);
  /**
   * 0 = asym encrypter
   * 1 = asym signer
   * 2 = sym encryptor
   */
  combined.set([type ?? 1]);
  combined.set(keyEncoded, 1);

  return base64Encode(combined);
};

export const keyImport: CryptoKeyImport = async (exported) => {
  const wc = await webcrypto();
  const dec = new TextDecoder();

  try {
    const combined = base64Decode(exported);
    const type = combined[0];
    const encoded = combined.slice(1);

    const jsonString = dec.decode(encoded);
    const jwk = JSON.parse(jsonString) as JsonWebKey;

    const [algorithm, usage] = ((t) => {
      switch (t) {
        case 0:
          return [
            {
              name: 'RSA-OAEP',
              modulusLength: 4096,
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: 'SHA-256',
            } as RsaHashedImportParams,
            ['encrypt'] as ['encrypt'],
          ];
        case 1:
          return [
            {
              name: 'ECDSA',
              namedCurve: 'P-256',
            } as EcKeyImportParams,
            ['verify'] as ['verify'],
          ];
        default:
          return [
            {
              name: 'AES-GCM',
              length: 256,
            },
            ['encrypt', 'decrypt'] as ['encrypt', 'decrypt'],
          ];
      }
    })(type);

    const key = await wc.subtle.importKey(
      'jwk',
      jwk,
      algorithm,
      true,
      usage,
    );

    return key;
  } catch (e) {
    return undefined;
  }
};
