import {
  AnyAction, Store,
} from '@reduxjs/toolkit';
import {
  pkceSetAuthPlatform,
  pkceGetAuthPlatform,
  pkceSetAuthPlatformCode,
  pkceGetAuthPlatformCode,
  pkceCreateChallenge,
  pkceGetVerifier,
} from '@amnis/auth/pkce.browser';
import {
  apiAuth,
} from '../auth/auth.react';

export interface PlatformMicrosoftConfig {
  authorizeEp: string;
  tokenEp: string;
  clientId: string,
  redirectUrl: string;
}

export interface PlatformMicrosoftConfigOptions {
  authorizeEp?: string;
  tokenEp?: string;
  clientId: string,
  redirectUrl: string;
}

let config: PlatformMicrosoftConfig = {
  authorizeEp: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize',
  tokenEp: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
  clientId: '',
  redirectUrl: 'http://localhost:3000/',
};

export function microsoftInit(store: Store, configuration: PlatformMicrosoftConfigOptions) {
  config = { ...config, ...configuration };

  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');
  const platform = pkceGetAuthPlatform();

  if (code && code !== pkceGetAuthPlatformCode() && platform === 'microsoft') {
    pkceSetAuthPlatformCode(code);
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', config.clientId);
    params.append('code', code);
    params.append('redirect_uri', config.redirectUrl);
    params.append('code_verifier', pkceGetVerifier());

    fetch(config.tokenEp, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }).then(async (response) => {
      const data = await response.json();
      store.dispatch(
        apiAuth.endpoints.platform.initiate({
          platform: 'microsoft',
          token: data?.access_token,
        }) as unknown as AnyAction,
      );
    });
  }
}

export async function microsoftLogin() {
  const authUrl = new URL(config.authorizeEp);
  pkceSetAuthPlatform('microsoft');

  const codeChallenge = await pkceCreateChallenge(pkceGetVerifier());
  authUrl.searchParams.append('client_id', config.clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', config.redirectUrl);
  authUrl.searchParams.append('response_mode', 'query');
  authUrl.searchParams.append('scope', 'openid profile email User.Read');
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  window.location.href = authUrl.href;
}

export default { microsoftInit, microsoftLogin };
