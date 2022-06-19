/* eslint-disable no-undef */
(() => {
/**
 * View Elements.
 */
  const loginButton = document.getElementById('login-msgraph');

  const msGraphConfig = {
    clientId: 'Enter_the_Application_Id_Here',
    authority: 'Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here',
    redirectUri: 'Enter_the_Redirect_Uri_Here',
  };

  const authEndpoint = `https://login.microsoftonline.com/${msGraphConfig.authority}/oauth2/v2.0/authorize`;

  loginButton.addEventListener('click', (e) => {
    window.location = authEndpoint;
  });
})();
