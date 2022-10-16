import fetch from 'cross-fetch';

import { dateNumeric } from '@amnis/core/core.js';
import type { Database } from '@amnis/db/types.js';
import { JWTEncoded, Token, tokenCreate } from '@amnis/core/token/index.js';
import type { StateCreate } from '@amnis/core/state/index.js';

import { jwtDecode } from '@amnis/auth/token.js';
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

export async function authMicrosoft(
  store: Store,
  database: Database,
  auth: Omit<ApiAuthBodyPkce, 'platform'>,
): Promise<ApiOutput<StateCreate>> {
  const tokenEndpoint = auth.tenantId
    ? `https://login.microsoftonline.${auth.gov ? 'us' : 'com'}/${auth.tenantId}/oauth2/v2.0/token`
    : `${apiConfig.API_MICROSOFT_OAUTH2_URL}token`;
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

  const microsoftId = jwtDecode(tokenData.id_token) as MicrosoftId;

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
  if (userSearch !== undefined) {
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

  /**
   * Set system settings from the store.
   */
  const system = selectors.selectActive<System>(store.getState(), systemKey);

  const registrationOutput = await register(
    database,
    system,
    username,
    {
      withTokens: true,
      otherTokens: tokens,
      nameDisplay: microsoftId.name || '',
      email: microsoftId.email,
      createSession: true,
    },
  );

  return registrationOutput;
}

export default { authMicrosoft };
