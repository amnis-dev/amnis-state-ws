import { JWTEncoded, JWTDecoded } from '@amnis/core/types';
import { authTokenSecret } from './const';
import { jwtVerify } from './token';

/**
 * Gets a JWT token from an authorization header
 */
function authorizationParse(authorization?: string | null): JWTDecoded | undefined {
  if (!authorization) {
    return undefined;
  }

  const [type, jwtEncoded] = authorization.split(' ');

  if (type !== 'Bearer' || !jwtEncoded) {
    return undefined;
  }

  const jwt = jwtVerify(jwtEncoded as JWTEncoded, authTokenSecret);
  return jwt;
}

export const authHeader = { authorizationParse };

export default authHeader;
