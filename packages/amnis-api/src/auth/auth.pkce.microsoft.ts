import fetch from 'cross-fetch';

import { dateNumeric } from '@amnis/core/core';
import type { Database } from '@amnis/db/types';
import { JWTEncoded, Token, tokenCreate } from '@amnis/core/token';
import type { StateCreate } from '@amnis/core/state';

import { jwtDecode } from '@amnis/auth/token';
import { Store } from '@reduxjs/toolkit';
import type { ApiAuthPkce } from './auth.types';
import { apiConfig } from '../config';
import { ApiOutput } from '../types';
import { loginSuccessProcess, userFindByName } from './auth.utility';
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

const tokenEndpoint = `${apiConfig.API_MICROSOFT_OAUTH2_URL}token`;
// const userEndpoint = `${API_MICROSOFT_OAUTH2_URL}users/me`;

export async function authMicrosoft(
  store: Store,
  database: Database,
  auth: ApiAuthPkce,
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

  if (typeof tokenData?.access_token !== 'string' || typeof tokenData?.id_token !== 'string') {
    output.status = 401; // Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Request',
      description: tokenData?.error_description || 'Could not verify OAuth 2.0 authentication.',
    });
    return output;
  }

  const microsoftId = jwtDecode<MicrosoftId>(tokenData.id_token);

  if (!microsoftId) {
    output.status = 401; // Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'ID Token Failure',
      description: 'The Microsoft ID token could not be decoded.',
    });
    return output;
  }

  /**
   * STEP 2
   * Obtain user information from the OAuth endpoint.
   */
  if (
    typeof microsoftId.name !== 'string'
    || typeof microsoftId.preferred_username !== 'string'
    || typeof microsoftId.oid !== 'string'
  ) {
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
  const username = `MS#${microsoftId.oid}`;
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
    api: 'microsoft',
    type: 'access',
    exp: dateNumeric(`${tokenData.expires_in}s`),
    jwt: tokenData.access_token,
  });
  tokens.push(tokenAccess);

  if (tokenData.refresh_token) {
    const tokenRefresh = tokenCreate({
      api: 'microsoft',
      type: 'refresh',
      exp: dateNumeric('200d'),
      jwt: tokenData.refresh_token,
    });
    tokens.push(tokenRefresh);
  }

  const registrationOutput = await register(
    store,
    database,
    username,
    {
      otherTokens: tokens,
      nameDisplay: microsoftId.name || '',
      email: microsoftId.email,
      createSession: true,
    },
  );

  return registrationOutput;
}

export default { authMicrosoft };
