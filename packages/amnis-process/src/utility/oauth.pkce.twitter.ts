import fetch from 'cross-fetch';
import {
  AuthPkce,
  dateNumeric,
  ioOutput,
  IoOutput,
  CryptoEncoded,
  selectActive,
  StateEntities,
  System,
  systemKey,
  Bearer,
  bearerCreate,
  IoContext,
} from '@amnis/core';

import { processConfig } from '../config.js';
import { loginSuccessProcess, userFindByName } from './common.js';
import { register } from './register.js';

/**
 * OAuth2 Response.
 */
interface OAuth2TokenData {
  bearer_type: string;
  expires_in: number,
  access_token: CryptoEncoded;
  scope: string;
  refresh_token?: CryptoEncoded;
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

const bearerEndpoint = `${processConfig.PROCESS_TWITTER_OAUTH2_URL}oauth2/bearer`;
const userEndpoint = `${processConfig.PROCESS_TWITTER_OAUTH2_URL}users/me`;

export async function oauthTwitter(
  context: IoContext,
  auth: Omit<AuthPkce, 'platform'>,
): Promise<IoOutput<StateEntities>> {
  const output = ioOutput<StateEntities>();
  /**
   * STEP 1
   * Get the access and refresh bearers.
   */
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', auth.clientId);
  params.append('code', auth.code);
  params.append('redirect_uri', auth.redirectUri);
  params.append('code_verifier', auth.codeVerifier);

  const bearerResponse = await fetch(bearerEndpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const bearerData = await bearerResponse.json() as OAuth2TokenData;

  if (bearerData.error || typeof bearerData?.access_token !== 'string') {
    output.status = 401; // Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Request',
      description: bearerData?.error_description || 'Could not verify OAuth 2.0 authentication.',
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
      Authorization: `Bearer ${bearerData.access_token}`,
    },
  });

  const userPayload = await userResponse.json();
  const userData = userPayload.data as TwitterUser;

  if (typeof userData.name !== 'string' || typeof userData.id !== 'string') {
    output.status = 401; // Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'Invaid Request',
      description: bearerData?.error_description || 'Could not obtain user with OAuth 2.0 authentication.',
    });
    return output;
  }

  /**
   * Step 3
   * Find the user or register a new one.
   */
  const username = `TR#${userData.id}`;
  const userSearch = await userFindByName(context.database, username);

  /**
   * If the user already exists, return the login success.
   */
  if (userSearch) {
    const successOutput = await loginSuccessProcess(context, userSearch);
    return successOutput;
  }

  /**
   * If a user didn't exist, register a new account.
   */
  const bearers: Bearer[] = [];

  const bearerAccess = bearerCreate({
    id: 'twitter',
    exp: dateNumeric(`${bearerData.expires_in}s`),
    access: bearerData.access_token as CryptoEncoded,
  });
  bearers.push(bearerAccess);

  // if (bearerData.refresh_token) {
  //   const bearerRefresh = bearerCreate({
  //     api: 'twitter',
  //     type: 'refresh',
  //     exp: dateNumeric('200d'),
  //     jwt: bearerData.refresh_token as CryptoEncoded,
  //   });
  //   bearers.push(bearerRefresh);
  // }

  /**
   * Set system settings from the store.
   */
  const system = selectActive<System>(context.store.getState(), systemKey);

  const registrationOutput = await register(
    context,
    system,
    username,
    {
      otherTokens: bearers,
      nameDisplay: userData?.name || '',
      createSession: true,
    },
  );

  return registrationOutput;
}

export default oauthTwitter;
