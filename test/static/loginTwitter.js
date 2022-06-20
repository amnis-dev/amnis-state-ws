/* eslint-disable no-undef */
(() => {
  /**
   * View Elements.
   */
  const loginButton = document.getElementById('login-twitter');
  const loginMsg = document.getElementById('login-msg');

  const authEndpoint = 'https://twitter.com/i/oauth2/authorize';
  const tokenEndpoint = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';

  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');
  const authPlatform = window.getAuthPlatform();

  if (code && authPlatform === 'twitter') {
    loginMsg.innerHTML = `SUCCESS: Got ${code} from Twitter oAuth 2.0 PKCE flow`;
    // const params = new URLSearchParams();
    // params.append('grant_type', 'authorization_code');
    // params.append('client_id', config.microsoftClientId);
    // params.append('code', code);
    // // params.append('scope', 'openid profile email User.Read');
    // params.append('redirect_uri', config.redirectUri);
    // params.append('code_verifier', window.pkceGetVerifier());

    // fetch(tokenEndpoint, {
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: params.toString(),
    // }).then((response) => {
    //   console.log(response);
    // });
  }

  loginButton.addEventListener('click', () => {
    const authUrl = new URL(authEndpoint);

    window.setAuthPlatform('twitter');

    window.pkceCreateChallenge(window.pkceGetVerifier()).then((codeChal) => {
      authUrl.searchParams.append('client_id', config.twitterClientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', config.redirectUri);
      // authUrl.searchParams.append('response_mode', 'query');
      authUrl.searchParams.append('scope', 'users.read');
      // authUrl.searchParams.append('state', 'state');
      authUrl.searchParams.append('code_challenge', codeChal);
      authUrl.searchParams.append('code_challenge_method', 'S256');

      window.location.href = authUrl.href;
    });
  });
})();
