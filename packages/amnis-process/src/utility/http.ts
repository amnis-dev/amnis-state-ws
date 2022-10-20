import { JWTEncoded } from '@amnis/core/token/index.js';

/**
 * Gets a JWT token from an authorization header
 */
export function httpAuthorizationParse(authorization?: string | null): JWTEncoded | undefined {
  if (!authorization) {
    return undefined;
  }

  const [type, jwtEncoded] = authorization.split(' ');

  if (type !== 'Bearer' || !jwtEncoded) {
    return undefined;
  }

  return jwtEncoded as JWTEncoded;
}

export default { httpAuthorizationParse };
