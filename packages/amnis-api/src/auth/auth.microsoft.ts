import fetch from 'cross-fetch';

import { dateNumeric } from '@amnis/core/index';
import type { Database } from '@amnis/db/index';
import type { JWTEncoded, Token } from '@amnis/core/token';
import type { ResultCreate } from '@amnis/core/state';

import { jwtDecode } from '@amnis/auth/token';
import type { ApiAuthPkce } from './auth.types';
import { API_MICROSOFT_OAUTH2_URL } from '../const';
import { ApiError, ApiOutput } from '../types';
import { loginSuccessProcess, userFind } from './auth.protility';
import { register } from './auth.register';
import { apiOutput } from '../api';

/**
 * OAuth2 Response.
 */
interface OAuth2TokenData {
  token_type: string;
  expires_in: number,
  ext_expires_in: number;
  access_token: JWTEncoded;
  id_token: JWTEncoded;
  scope: string;
  refresh_token?: JWTEncoded;
  error?: string;
  error_description?: string;
}

/**
 * Microsoft Graph User
 */
export interface MicrosoftId {
  name: string;
  preferred_username: string;
  oid: string,
  email: string,
}

const tokenEndpoint = `${API_MICROSOFT_OAUTH2_URL}token`;
// const userEndpoint = `${API_MICROSOFT_OAUTH2_URL}users/me`;

export async function authMicrosoft(
  database: Database,
  auth: ApiAuthPkce,
): Promise<ApiOutput<ResultCreate>> {
  const output = apiOutput<ResultCreate>();
  /**
   * STEP 1
   * Get the access and refresh tokens.
   */
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', auth.clientId);
  params.append('code', auth.code);
  params.append('redirect_uri', auth.redirectUri);
  params.append('code_verifier', auth.codeVerifier);

  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const tokenData = await tokenResponse.json() as OAuth2TokenData;

  if (typeof tokenData?.access_token !== 'string' || typeof tokenData?.id_token !== 'string') {
    const error: ApiError = {
      title: 'Invaid Request',
      message: tokenData?.error_description || 'Could not verify OAuth 2.0 authentication.',
    };
    output.status = 401; // Unauthorized
    output.json.errors.push(error);
    return output;
  }

  const microsoftId = jwtDecode(tokenData.id_token) as MicrosoftId;

  /**
   * STEP 2
   * Obtain user information from the OAuth endpoint.
   */
  if (
    typeof microsoftId.name !== 'string'
    || typeof microsoftId.preferred_username !== 'string'
    || typeof microsoftId.oid !== 'string'
  ) {
    const error: ApiError = {
      title: 'Invaid Request',
      message: tokenData?.error_description || 'Could not obtain user with OAuth 2.0 authentication.',
    };
    output.status = 401; // Unauthorized
    output.json.errors.push(error);
    return output;
  }

  /**
   * Step 3
   * Find the user or register a new one.
   */
  const username = `MS#${microsoftId.oid}`;
  const userSearch = await userFind(database, username);

  /**
   * If the user already exists, return the login success.
   */
  if (userSearch) {
    const successOutput = await loginSuccessProcess(database, userSearch);
    return successOutput;
  }

  /**
   * If a user didn't exist, register a new account.
   */
  const tokens: Token[] = [
    {
      api: 'microsoft',
      type: 'access',
      exp: dateNumeric(`${tokenData.expires_in}s`),
      jwt: tokenData.access_token,
    },
  ];

  if (tokenData.refresh_token) {
    tokens.push({
      api: 'microsoft',
      type: 'refresh',
      exp: dateNumeric('200d'),
      jwt: tokenData.refresh_token,
    });
  }

  const registrationOutput = await register(
    database,
    username,
    {
      tokens,
      nameDisplay: microsoftId.name || username,
      email: microsoftId.email,
      createSession: true,
    },
  );

  return registrationOutput;
}

export default { authMicrosoft };
