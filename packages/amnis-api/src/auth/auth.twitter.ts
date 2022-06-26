import fetch from 'cross-fetch';

import { dateNumeric } from '@amnis/core/index';
import type { Database } from '@amnis/db/index';
import type { JWTEncoded, Token } from '@amnis/core/token';
import type { ResultCreate } from '@amnis/core/state';

import type { ApiAuthPkce } from './auth.types';
import { API_TWITTER_OAUTH2_URL } from '../const';
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
  access_token: JWTEncoded;
  scope: string;
  refresh_token?: JWTEncoded;
  error?: string,
  error_description?: string;
}

/**
 * Minimal Twitter user interface.
 */
export interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

const tokenEndpoint = `${API_TWITTER_OAUTH2_URL}oauth2/token`;
const userEndpoint = `${API_TWITTER_OAUTH2_URL}users/me`;

export async function authTwitter(
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

  if (tokenData.error || typeof tokenData?.access_token !== 'string') {
    const error: ApiError = {
      title: 'Invaid Request',
      message: tokenData?.error_description || 'Could not verify OAuth 2.0 authentication.',
    };
    output.status = 401; // Unauthorized
    output.json.errors.push(error);
    return output;
  }

  /**
   * STEP 2
   * Obtain user information from the OAuth endpoint.
   */
  const userResponse = await fetch(userEndpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const userPayload = await userResponse.json();
  const userData = userPayload.data as TwitterUser;

  if (typeof userData.name !== 'string' || typeof userData.id !== 'string') {
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
  const username = `TR#${userData.id}`;
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
      api: 'twitter',
      type: 'access',
      exp: dateNumeric(`${tokenData.expires_in}s`),
      jwt: tokenData.access_token as JWTEncoded,
    },
  ];

  if (tokenData.refresh_token) {
    tokens.push({
      api: 'twitter',
      type: 'refresh',
      exp: dateNumeric('200d'),
      jwt: tokenData.refresh_token as JWTEncoded,
    });
  }

  const registrationOutput = await register(
    database,
    username,
    {
      tokens,
      nameDisplay: userData?.name || username,
      createSession: true,
    },
  );

  return registrationOutput;
}

export default { authTwitter };
