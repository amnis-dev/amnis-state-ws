import type {
  AnyAction, Store,
} from '@reduxjs/toolkit/index.js';
import {
  pkceSetAuthPlatform,
  pkceGetAuthPlatform,
  pkceCreateChallenge,
  pkceGetVerifier,
} from './spa.pkce.js';
import {
  apiAuth,
} from '../auth/auth.api.js';

export interface PlatformMicrosoftConfig {
  authorizeEp: string;
  clientId: string,
  redirectUri: string;
}

export interface PlatformMicrosoftConfigOptions {
  authorizeEp?: string;
  clientId: string,
  redirectUri: string;
}

let config: PlatformMicrosoftConfig = {
  authorizeEp: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize',
  clientId: '',
  redirectUri: 'http://localhost:3000/',
};

export function microsoftInit(store: Store, configuration: PlatformMicrosoftConfigOptions) {
  config = { ...config, ...configuration };

  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');
  const platform = pkceGetAuthPlatform();

  if (
    platform === 'microsoft'
    && typeof code === 'string'
  ) {
    pkceSetAuthPlatform('');
    // const params = new URLSearchParams();
    // params.append('grant_type', 'authorization_code');
    // params.append('client_id', config.clientId);
    // params.append('code', code);
    // params.append('redirect_uri', config.redirectUri);
    // params.append('code_verifier', pkceGetVerifier());

    const { clientId, redirectUri } = config;

    store.dispatch(
      apiAuth.endpoints.pkce.initiate({
        platform,
        clientId,
        redirectUri,
        code,
        codeVerifier: pkceGetVerifier(),
      }) as unknown as AnyAction,
    );
  }
}

export async function microsoftLogin() {
  const authUrl = new URL(config.authorizeEp);
  pkceSetAuthPlatform('microsoft');

  const codeChallenge = await pkceCreateChallenge(pkceGetVerifier(true));
  authUrl.searchParams.append('client_id', config.clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', config.redirectUri);
  authUrl.searchParams.append('response_mode', 'query');
  authUrl.searchParams.append('scope', 'openid profile email User.Read');
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  window.location.href = authUrl.href;
}

export default { microsoftInit, microsoftLogin };
