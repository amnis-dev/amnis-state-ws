import { JWTEncoded } from '@amnis/core/token/index.js';

/**
 * Gets a JWT token from an authorization header
 */
function authorizationParse(authorization?: string | null): JWTEncoded | undefined {
  if (!authorization) {
    return undefined;
  }

  const [type, jwtEncoded] = authorization.split(' ');

  if (type !== 'Bearer' || !jwtEncoded) {
    return undefined;
  }

  return jwtEncoded as JWTEncoded;
}

export const authHeader = { authorizationParse };

export default authHeader;
