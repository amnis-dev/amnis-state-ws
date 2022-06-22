/* eslint-disable no-undef */
(() => {
  /**
   * View Elements.
   */
  const loginButton = document.getElementById('login-twitter');
  const loginMsg = document.getElementById('login-msg');

  const authEndpoint = 'https://twitter.com/i/oauth2/authorize';

  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');
  const state = currentUrl.searchParams.get('state');
  const authPlatform = window.getAuthPlatform();

  if (
    typeof code === 'string'
    && typeof state === 'string'
    && authPlatform === 'twitter'
    // && state === window.pkceGetState()
  ) {
    window.setAuthPlatform('');
    loginMsg.innerHTML = `SUCCESS: Got ${code} from Twitter oAuth 2.0 PKCE flow`;

    fetch('http://localhost:3000/auth/pkce', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: 'twitter',
        clientId: config.twitterClientId,
        code,
        codeVerifier: window.pkceGetVerifier(),
        redirectUri: config.redirectUri,
      }),
    }).then((response) => {
      console.log(response);
    });
  }

  loginButton.addEventListener('click', () => {
    const authUrl = new URL(authEndpoint);

    window.setAuthPlatform('twitter');

    window.pkceCreateChallenge(window.pkceGetVerifier(true)).then((codeChal) => {
      authUrl.searchParams.append('client_id', config.twitterClientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', config.redirectUri);
      // authUrl.searchParams.append('response_mode', 'query');
      authUrl.searchParams.append('scope', 'users.read tweet.read offline.access');
      authUrl.searchParams.append('state', window.pkceGetState(true));
      authUrl.searchParams.append('code_challenge', codeChal);
      authUrl.searchParams.append('code_challenge_method', 'S256');

      window.location.href = authUrl.href;
    });
  });
})();
