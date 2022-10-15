import {
  AnyAction, Store,
} from '@reduxjs/toolkit';
import {
  pkceSetAuthPlatform,
  pkceGetAuthPlatform,
  pkceCreateChallenge,
  pkceGetVerifier,
  pkceGetState,
} from '@amnis/auth/pkce.browser.js';
import {
  apiAuth,
} from '../auth/auth.api.node.js';

export interface PlatformTwitterConfig {
  authorizeEp: string;
  clientId: string,
  redirectUri: string;
}

export interface PlatformTwitterConfigOptions {
  authorizeEp?: string;
  clientId: string,
  redirectUri: string;
}

let config: PlatformTwitterConfig = {
  authorizeEp: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize',
  clientId: '',
  redirectUri: 'http://localhost:3000/',
};

export function twitterInit(store: Store, configuration: PlatformTwitterConfigOptions) {
  config = { ...config, ...configuration };

  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');
  const state = currentUrl.searchParams.get('state');
  const platform = pkceGetAuthPlatform();

  if (
    platform === 'twitter'
    && typeof code === 'string'
    && state === pkceGetState()
  ) {
    pkceSetAuthPlatform('');

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

export async function twitterLogin() {
  const authUrl = new URL(config.authorizeEp);
  pkceSetAuthPlatform('twitter');

  const codeChallenge = await pkceCreateChallenge(pkceGetVerifier(true));
  authUrl.searchParams.append('client_id', config.clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', config.redirectUri);
  authUrl.searchParams.append('scope', 'users.read tweet.read');
  authUrl.searchParams.append('state', pkceGetState(true));
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  window.location.href = authUrl.href;
}

export default { twitterInit, twitterLogin };
