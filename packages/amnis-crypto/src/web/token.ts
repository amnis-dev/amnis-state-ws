/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  base64Decode,
  base64Encode,
  CryptoAsymSignature,
  CryptoToken,
  CryptoTokenDecode,
  CryptoTokenEncode,
  CryptoTokenVerify,
  dateNumeric,
} from '@amnis/core';
import { asymSign, asymVerify } from './asym.js';
// import { webcrypto } from '../webcrypto.js';

export const tokenSign: CryptoTokenEncode = async (json, privateKey) => {
  const header = {
    alg: 'ES256',
    typ: 'JWT',
  };

  const now = dateNumeric() / 1000;

  const payload = {
    iat: now,
    exp: now,
    ...json,
  };

  const enc = new TextEncoder();

  const headerBase64 = base64Encode(enc.encode(JSON.stringify(header)), true);
  const payloadBase64 = base64Encode(enc.encode(JSON.stringify(payload)), true);

  const dataString = `${headerBase64}.${payloadBase64}`;

  const signature = await asymSign(dataString, privateKey) as ArrayBuffer;
  const signatureBase64 = base64Encode(new Uint8Array(signature), true);

  return `${dataString}.${signatureBase64}` as CryptoToken;
};

export const tokenVerify: CryptoTokenVerify = async (encoded, publicKey) => {
  const [headerB64, payloadB64, signatureB64] = encoded.split('.');

  if (!signatureB64 || !payloadB64 || !headerB64) {
    // console.warn('Token is not properly formatted');
    return undefined;
  }

  const dec = new TextDecoder();

  try {
    const header = JSON.parse(dec.decode(base64Decode(headerB64)));
    const payload = JSON.parse(dec.decode(base64Decode(payloadB64)));
    const now = dateNumeric() / 1000;

    const signatureUnpadded = base64Decode(signatureB64);
    // const padding = new Uint8Array([187]);
    const signature = new Uint8Array(64);
    signature.set(signatureUnpadded);
    const verified = await asymVerify(
      `${headerB64}.${payloadB64}`,
      signature.buffer as CryptoAsymSignature,
      publicKey,
    );

    if (header.typ !== 'JWT') {
      // console.warn('Header is not formatted correctly');
      return undefined;
    }

    if (!verified) {
      // console.warn('Could not verify token');
      return undefined;
    }

    if (!payload.exp || payload.exp <= now) {
      // console.warn('Token has expired');
      return undefined;
    }

    return payload;
  } catch (error) {
    // console.error('Failed to parse token');
    return undefined;
  }
};

export const tokenDecode: CryptoTokenDecode = async (encoded) => {
  const [headerB64, payloadB64, signatureB64] = encoded.split('.');

  if (!signatureB64 || !payloadB64 || !headerB64) {
    // console.warn('Token is not properly formatted');
    return undefined;
  }

  const dec = new TextDecoder();

  try {
    const payload = JSON.parse(dec.decode(base64Decode(payloadB64)));

    if (!payload) {
      return undefined;
    }

    return payload;
  } catch (error) {
    // console.error('Failed to parse token');
    return undefined;
  }
};
