import { CryptoEncoded } from '@amnis/core';

/**
 * Gets a JWT bearer from an authorization header
 */
export function httpAuthorizationParse(authorization?: string | null): CryptoEncoded | undefined {
  if (!authorization) {
    return undefined;
  }

  const [type, accessEncoded] = authorization.split(' ');

  if (type !== 'Bearer' || !accessEncoded) {
    return undefined;
  }

  return accessEncoded as CryptoEncoded;
}

export default { httpAuthorizationParse };
