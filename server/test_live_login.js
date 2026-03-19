const axios = require('axios');

async function testLiveLogin() {
  try {
    const res = await axios.post('https://resplendent-sherbet-2e8955.netlify.app/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    console.log('Login successful:', res.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
      console.log('Status:', error.response.status);
    } else {
      console.log('Error Message:', error.message);
    }
  }
}

testLiveLogin();
