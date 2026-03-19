const axios = require('axios');

async function testSignupAndLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/signup', {
      username: 'testuser_debug' + Date.now(),
      email: 'testuser_debug' + Date.now() + '@example.com',
      password: 'Password123'
    });
    console.log('Signup successful', res.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error Message:', error.message);
    }
  }
}
testSignupAndLogin();
