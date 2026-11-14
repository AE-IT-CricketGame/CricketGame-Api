const axios = require('axios');

const getToken = async () => {
  try {
    const response = await axios.post(
      process.env.FRIMI_API_URL,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: process.env.FRIMI_API_AUTHORIZATION,
        },
      }
    );
    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error('Error generating token:', error.response?.data || error.message);
    throw new Error('Token generation failed');
  }
};

module.exports = { getToken };
