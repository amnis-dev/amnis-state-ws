import fetch from 'cross-fetch';

import { dateNumeric } from '@amnis/core/core.js';
import type { Database } from '@amnis/core/database.types.js';
import { JWTEncoded, Token, tokenCreate } from '@amnis/core/token/index.js';
import type { StateCreate } from '@amnis/core/state/index.js';

import type { Store } from '@reduxjs/toolkit/index.js';
import { selectors } from '@amnis/core/selectors.js';
import { System, systemKey } from '@amnis/core/system/index.js';
import type { ApiAuthBodyPkce } from './auth.types.js';
import { apiConfig } from '../config.js';
import { ApiOutput } from '../types.js';
import { loginSuccessProcess, userFindByName } from './auth.utility.js';
import { register } from './auth.register.js';
import { apiOutput } from '../api.js';

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

const tokenEndpoint = `${apiConfig.API_TWITTER_OAUTH2_URL}oauth2/token`;
const userEndpoint = `${apiConfig.API_TWITTER_OAUTH2_URL}users/me`;

export async function authTwitter(
  store: Store,
  database: Database,
  auth: Omit<ApiAuthBodyPkce, 'platform'>,
): Promise<ApiOutput<StateCreate>> {
  const output = apiOutput<StateCreate>();
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
    output.status = 401; // Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Request',
      description: tokenData?.error_description || 'Could not verify OAuth 2.0 authentication.',
    });
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
    output.status = 401; // Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Request',
      description: tokenData?.error_description || 'Could not obtain user with OAuth 2.0 authentication.',
    });
    return output;
  }

  /**
   * Step 3
   * Find the user or register a new one.
   */
  const username = `TR#${userData.id}`;
  const userSearch = await userFindByName(database, username);

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
  const tokens: Token[] = [];

  const tokenAccess = tokenCreate({
    api: 'twitter',
    type: 'access',
    exp: dateNumeric(`${tokenData.expires_in}s`),
    jwt: tokenData.access_token as JWTEncoded,
  });
  tokens.push(tokenAccess);

  if (tokenData.refresh_token) {
    const tokenRefresh = tokenCreate({
      api: 'twitter',
      type: 'refresh',
      exp: dateNumeric('200d'),
      jwt: tokenData.refresh_token as JWTEncoded,
    });
    tokens.push(tokenRefresh);
  }

  /**
   * Set system settings from the store.
   */
  const system = selectors.selectActive<System>(store.getState(), systemKey);

  const registrationOutput = await register(
    database,
    system,
    username,
    {
      otherTokens: tokens,
      nameDisplay: userData?.name || '',
      createSession: true,
    },
  );

  return registrationOutput;
}

export default { authTwitter };
