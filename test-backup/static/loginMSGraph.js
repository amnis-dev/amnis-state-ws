/* eslint-disable no-undef */
(() => {
  /**
   * View Elements.
   */
  const loginButton = document.getElementById('login-msgraph');
  const loginMsg = document.getElementById('login-msg');

  const authEndpoint = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize';

  const currentUrl = new URL(window.location.href);
  const code = currentUrl.searchParams.get('code');
  const authPlatform = window.getAuthPlatform();

  if (code && authPlatform === 'microsoft') {
    window.setAuthPlatform('');
    loginMsg.innerHTML = `IN PROCESS... Got ${code} from Microsoft oAuth 2.0 PKCE flow`;

    fetch('http://localhost:3000/auth/pkce', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: 'microsoft',
        clientId: config.microsoftClientId,
        code,
        codeVerifier: window.pkceGetVerifier(),
        redirectUri: config.redirectUri,
      }),
    }).then((response) => {
      loginMsg.innerHTML = 'SUCCESSFUL LOGIN!';
      console.log(response);
    }).catch(() => {
      loginMsg.innerHTML = 'Login failed...';
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
