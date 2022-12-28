import fetch from 'cross-fetch';
import {
  ApiAuthPkce,
  dateNumeric,
  ioOutput,
  IoOutput,
  StateEntities,
  Bearer,
  bearerCreate,
  IoContext,
} from '@amnis/core';

import { systemSelectors } from '@amnis/state';
import { processConfig } from '../config.js';
import { findUserByHandle } from './find.js';

/**
 * OAuth2 Response.
 */
interface OAuth2TokenData {
  bearer_type: string;
  expires_in: number,
  ext_expires_in: number;
  access_token: string;
  id_token: string;
  scope: string;
  refresh_token?: string;
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

export async function oauthMicrosoft(
  context: IoContext,
  auth: Omit<ApiAuthPkce, 'platform'>,
): Promise<IoOutput<StateEntities>> {
  // const bearerEndpoint = auth.tenantId
  //   ? `https://login.microsoftonline.${auth.gov ? 'us' : 'com'}/${auth.tenantId}/oauth2/v2.0/bearer`
  //   : `${processConfig.PROCESS_MICROSOFT_OAUTH2_URL}bearer`;
  // const output = ioOutput<StateEntities>();

  // /**
  //  * STEP 1
  //  * Get the access and refresh bearers.
  //  */
  // const params = new URLSearchParams();
  // params.append('grant_type', 'authorization_code');
  // params.append('client_id', auth.clientId);
  // params.append('code', auth.code);
  // params.append('redirect_uri', auth.redirectUri);
  // params.append('code_verifier', auth.codeVerifier);

  // const bearerResponse = await fetch(bearerEndpoint, {
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   body: params.toString(),
  // });

  // const bearerData = await bearerResponse.json() as OAuth2TokenData;

  // if (typeof bearerData?.access_token !== 'string' || typeof bearerData?.id_token !== 'string') {
  //   output.status = 401; // Unauthorized
  //   output.json.logs.push({
  //     level: 'error',
  //     title: 'Invaid Request',
  //     description: bearerData?.error_description || 'Could not verify OAuth 2.0 authentication.',
  //   });
  //   return output;
  // }

  // const microsoftId = await context.crypto.tokenDecode<MicrosoftId>(bearerData.id_token);

  // if (!microsoftId) {
  //   output.status = 401; // Unauthorized
  //   output.json.logs.push({
  //     level: 'error',
  //     title: 'ID Bearer Failure',
  //     description: 'The Microsoft ID bearer could not be decoded.',
  //   });
  //   return output;
  // }

  // /**
  //  * STEP 2
  //  * Obtain user information from the OAuth endpoint.
  //  */
  // if (
  //   typeof microsoftId.name !== 'string'
  //   || typeof microsoftId.preferred_username !== 'string'
  //   || typeof microsoftId.oid !== 'string'
  // ) {
  //   output.status = 401; // Unauthorized
  //   output.json.logs.push({
  //     level: 'error',
  //     title: 'Invaid Request',
  //     description:
  //       bearerData?.error_description || 'Could not obtain user with OAuth 2.0 authentication.',
  //   });
  //   return output;
  // }

  // /**
  //  * Step 3
  //  * Find the user or register a new one.
  //  */
  // const handle = `MS#${microsoftId.oid}`;
  // const userSearch = await findUserByHandle(context, handle);

  // /**
  //  * If the user already exists, return the login success.
  //  */
  // if (userSearch !== undefined) {
  //   const successOutput = await loginSuccessProcess(context, userSearch);
  //   return successOutput;
  // }

  // /**
  //  * If a user didn't exist, register a new account.
  //  */
  // const bearers: Bearer[] = [];

  // const bearerAccess = bearerCreate({
  //   id: 'microsoft',
  //   exp: dateNumeric(`${bearerData.expires_in}s`),
  //   access: bearerData.access_token,
  // });
  // bearers.push(bearerAccess);

  // // if (bearerData.refresh_token) {
  // //   const bearerRefresh = bearerCreate({
  // //     api: 'microsoft',
  // //     type: 'refresh',
  // //     exp: dateNumeric('200d'),
  // //     jwt: bearerData.refresh_token,
  // //   });
  // //   bearers.push(bearerRefresh);
  // // }

  // /**
  //  * Set system settings from the store.
  //  */
  // const system = systemSelectors.selectActive(context.store.getState());

  // const registrationOutput = await register(
  //   context,
  //   system,
  //   handle,
  //   {
  //     withTokens: true,
  //     otherTokens: bearers,
  //     nameDisplay: microsoftId.name || '',
  //     email: microsoftId.email,
  //     createSession: true,
  //   },
  // );

  // return registrationOutput;

  const output = ioOutput();
  return output;
}

export default oauthMicrosoft;
