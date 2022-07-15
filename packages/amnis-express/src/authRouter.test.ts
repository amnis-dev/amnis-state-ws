import fetch from 'cross-fetch';

test('should attempt to login', async () => {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'Normie',
      password: 'passwd12',
    }),
  });

  const output = await response.json();

  console.log(JSON.stringify(output, null, 2));
});
