/* eslint-disable no-undef */
(() => {
  /**
   * View Elements.
   */
  const loginButton = document.getElementById('login-msgraph');
  const loginMsg = document.getElementById('login-msg');

  const authEndpoint = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize';
  const tokenEndpoint = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';

  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');
  const authPlatform = window.getAuthPlatform();

  if (code && authPlatform === 'microsoft') {
    loginMsg.innerHTML = `SUCCESS: Got ${code} from Microsoft oAuth 2.0 PKCE flow`;
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', config.microsoftClientId);
    params.append('code', code);
    // params.append('scope', 'openid profile email User.Read');
    params.append('redirect_uri', config.redirectUri);
    params.append('code_verifier', window.pkceGetVerifier());

    fetch(tokenEndpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }).then((response) => {
      response.json().then((data) => {
        fetch('http://localhost:3000/auth/platform', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: 'microsoft',
            token: data?.access_token,
          }),
        }).then(async (result) => {
          const authData = await result.json();
          console.log('PLATFORM RESULT:', authData);
          loginMsg.innerHTML = 'Got a response. See console for results...';
        });
      });
    });
  }

  loginButton.addEventListener('click', () => {
    const authUrl = new URL(authEndpoint);

    window.setAuthPlatform('microsoft');

    window.pkceCreateChallenge(window.pkceGetVerifier()).then((codeChal) => {
      authUrl.searchParams.append('client_id', config.microsoftClientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', config.redirectUri);
      authUrl.searchParams.append('response_mode', 'query');
      authUrl.searchParams.append('scope', 'openid profile email User.Read');
      authUrl.searchParams.append('code_challenge', codeChal);
      authUrl.searchParams.append('code_challenge_method', 'S256');

      window.location.href = authUrl.href;
    });
  });
})();
