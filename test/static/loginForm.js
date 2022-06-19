/* eslint-disable no-undef */
(() => {
/**
 * View Elements.
 */
  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-form-submit');
  const loginMsg = document.getElementById('login-msg');

  /**
  * Login functions
  */
  async function login(loginData) {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    return response.json();
  }

  /**
  * Basic Username/Password form submission.
  */
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    login({
      username,
      password,
    }).then((data) => {
      if (data.errors?.length) {
        const errorHtml = data.errors.map(({ title, message }) => (`${title}: ${message}<br/>`)).join('');
        loginMsg.innerHTML = errorHtml;
      } else {
        const { result } = data;
        const user = result.user[0];
        const successHtml = `
       Login successful for ${user.name}.<br/>
       ID: ${user.$id}<br/>
       Email: ${user.email}<br/>
       `;
        loginMsg.innerHTML = successHtml;
      }
    });
  });
})();
